const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const withImages = require('next-images');

module.exports = {
  webpack: (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    return config;
  },
};

module.exports = withImages();