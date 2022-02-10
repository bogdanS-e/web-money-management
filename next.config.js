const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const dotenv = require('dotenv');
const withImages = require('next-images');
const env = dotenv.config().parsed;

module.exports = {
  env,
  webpack: (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin());
  
    return config;
  }
};

module.exports = withImages();