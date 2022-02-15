const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const withImages = require('next-images');

module.exports = {
  webpack: (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    return config;
  },
  env: {
    MONGO_URL: 'mongodb+srv://root:root@cluster0.ullsi.mongodb.net/money-management?retryWrites=true&w=majority',
    NEXT_PUBLIC_BASE_URL: 'http://localhost:3000/api',
    MAIL_ID: 'seredenko.bohdan@chnu.edu.ua',
    MAIL_PASSWORD: '135seredenko135',
  },
};

module.exports = withImages();