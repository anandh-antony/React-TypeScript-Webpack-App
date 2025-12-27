const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = (envVars = {}) => {
  const providedEnv = typeof envVars === 'string' ? envVars : envVars.env;
  const env = providedEnv || process.env.NODE_ENV || 'dev';
  const envPath = path.resolve(__dirname, `./webpack.${env}.js`);

  let envConfig;
  try {
    envConfig = require(envPath);
    // If env config exports a function, call it with envVars for flexibility
    envConfig = typeof envConfig === 'function' ? envConfig(envVars) : envConfig;
  } catch (err) {
    throw new Error(`Failed to load webpack env config "${env}" from "${envPath}": ${err.message}`);
  }

  return merge(commonConfig, envConfig);
};
