const fs = require('fs');
const path = require('path');
const { paths } = require('react-app-rewired');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = rewiredEsbuild;

/**
 * replace babel to esbuild
 * @link https://github.com/privatenumber/esbuild-loader
 * @param ESBuildMinifyOptions
 * @param ESBuildLoaderOptions
 * @param onlyMinimizer
 * @return {function(*, *): *}
 */
function rewiredEsbuild({ ESBuildMinifyOptions, ESBuildLoaderOptions, onlyMinimizer } = {}) {
  return function (config) {
    const useTypeScript = fs.existsSync(paths.appTsConfig);

    if (!onlyMinimizer) {
      // replace babel-loader to esbuild-loader
      for (const { oneOf } of config.module.rules) {
        if (oneOf) {
          let babelLoaderIndex = -1;
          const rules = Object.entries(oneOf);
          for (const [index, rule] of rules.slice().reverse()) {
            if (rule.loader && rule.loader.includes(path.sep + 'babel-loader' + path.sep)) {
              oneOf.splice(index, 1);
              babelLoaderIndex = index;
            }
          }
          if (~babelLoaderIndex) {
            oneOf.splice(babelLoaderIndex, 0, {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: [paths.appSrc],
              loader: require.resolve('esbuild-loader'),
              options: ESBuildLoaderOptions || {
                loader: useTypeScript ? 'tsx' : 'jsx',
                target: 'es2015',
              },
            });
          }
        }
      }
    }

    // replace minimizer
    for (const [index, minimizer] of Object.entries(config.optimization.minimizer)
      .slice()
      .reverse()) {
      const options = ESBuildMinifyOptions || {
        target: 'es2015',
        css: true,
      };
      // replace TerserPlugin to ESBuildMinifyPlugin
      if (minimizer.constructor.name === 'TerserPlugin') {
        config.optimization.minimizer.splice(index, 1, new ESBuildMinifyPlugin(options));
      }
      // remove OptimizeCssAssetsWebpackPlugin
      if (options.css && minimizer.constructor.name === 'OptimizeCssAssetsWebpackPlugin') {
        config.optimization.minimizer.splice(index, 1);
      }
    }

    return config;
  };
}
