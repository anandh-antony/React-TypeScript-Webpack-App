# React-TypeScript-Webpack-App — Custom Webpack Setup

A concise, step-by-step guide to set up a custom Webpack configuration for a React app (with TypeScript).

---

## ✅ Prerequisites

- Node.js and npm installed
- Basic knowledge of React and TypeScript

---

## 1. Initialize the project

```bash
mkdir React-TypeScript-Webpack-App
cd React-TypeScript-Webpack-App
npm init --y
```

This creates a basic Node project.

---

## 2. Install core dependencies

React:

```bash
npm install react react-dom
```

TypeScript:

```bash
npm install -D typescript @types/react @types/react-dom
```

Webpack & related tools:

```bash
npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin
```

- `webpack` → bundler
- `webpack-cli` → CLI commands
- `webpack-dev-server` → local dev server + HMR
- `html-webpack-plugin` → automatically injects bundled JS into HTML

---

## 3. Install Babel (for JSX & modern JS)

```bash
npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
```

Browsers don’t understand JSX — Babel transpiles JSX + modern JS for browsers.

---

## 4. Create Babel config

Create `babel.config.js`:

```js
module.exports = {
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
};
```

This enables:

- Modern JS → browser-compatible JS
- JSX → React code
- TypeScript transpilation via Babel

---

## 5. Create HTML template

Create `public/index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React Webpack App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

## 6. Create React entry files

`src/App.js` (or `src/App.tsx` if using TypeScript):

```jsx
export default function App() {
  return <h1>Hello from Custom Webpack</h1>;
}
```

`src/index.js` (or `src/index.tsx`):

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## 7. Install CSS & asset loaders

```bash
npm install -D css-loader style-loader
```

Add rules to your webpack module rules:

```js
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
},
{
  test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
  type: 'asset/resource',
},
{
  test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
  type: 'asset/inline',
},
```

---

## 8. Create Webpack config files

Install `webpack-merge`:

```bash
npm install -D webpack-merge
```

`webpack.config.js` (env-aware loader):

```js
const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = (envVars = {}) => {
  const providedEnv = typeof envVars === 'string' ? envVars : envVars.env;
  const env = providedEnv || process.env.NODE_ENV || 'dev';
  const envPath = path.resolve(__dirname, `./webpack.${env}.js`);

  let envConfig = require(envPath);

  return merge(commonConfig, envConfig);
};
```

`webpack.dev.js` (dev server + React refresh):

```bash
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

```js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
};
```

`webpack.common.js` (shared config):

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './src/index.html'),
    }),
  ],
  stats: 'errors-only',
};
```

**What this does:**

- Entry → `index.js`/`index.tsx`
- Babel → JSX & modern JS support
- HTML auto-generation
- Dev server with HMR

---

## 9. Useful npm scripts

Add to `package.json`:

```json
"scripts": {
  "start": "webpack serve --env dev --mode development",
  "build": "webpack --env prod --mode production"
}
```

Run dev server:

```bash
npm start
```

Build production bundle:

```bash
npm run build
```

---

## Notes & best practices

- If using `DefinePlugin` to inject values like `process.env.name`, do not put secrets there — bundle is public.
- For TypeScript, add a declaration for custom env keys (e.g., `name`) in `src/declarations.d.ts`:

```ts
declare namespace NodeJS {
  interface ProcessEnv {
    name?: string;
  }
}
```

- Keep configs small and composable — split env-specific options into `webpack.dev.js` / `webpack.prod.js`.

---

If you want, I can:

- Add TypeScript declaration file for `process.env.name`
- Update `webpack.prod.js` to read from the real environment (`process.env.NAME`)
- Add CI/build scripts

Happy to continue — tell me which of the above you'd like next! 🎯
