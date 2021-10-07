# react-app-rewired-esbuild

Use `esbuild` in your `create-react-app`.   

`react-scripts` When the project grows, the compilation speed is slow, and the development uses `esbuild` to improve the compilation speed.

> It is recommended to use the development mode to ensure stability !!!

## Features

- Relpace `babel-loader` to `esbuild-loader` for faster build time
- Relpace `TerserPlugin` to `ESBuildMinifyPlugin` for faster build time

## Installation

```bash
npm i react-app-rewired-esbuild -D
```

## Usage
This project is based on [`react-app-rewired`](https://github.com/timarney/react-app-rewired).

```js
/* config-overrides.js */

const rewiredEsbuild = require('eact-app-rewired-esbuild');

module.exports = function override(config, env) {
  // your config ...
  return rewiredEsbuild()(config, env);
};

// use `customize-cra`
const { override } = require("customize-cra");

module.exports = override(
    rewiredEsbuild()
);
```

## Options
specification [`esbuild-loader`](https://github.com/privatenumber/esbuild-loader)

### ESBuildLoaderOptions
Type: `object`   
Default: 
```js
{
    loader: useTypeScript ? 'tsx' : 'jsx',
    target: 'es2015',
}
```   

### ESBuildMinifyOptions
Type: `object`   
Default: 
```js
{
    loader: useTypeScript ? 'tsx' : 'jsx',
    css: true,
}
``` 

## FQA

### ReferenceError: React is not defined
Added react introduction in the first line of the error file,Originally, babel-plugin-react-app handled this situation, but esbuild did not.   

### Why is it faster?
Originally, create-react-app was compiled with babel, and [esbuild](https://github.com/evanw/esbuild) would be faster to compile

## License

MIT © [fupengl](https://github.com/fupengl)