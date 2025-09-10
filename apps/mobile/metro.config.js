const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable workspace support
config.watchFolders = [
  ...config.watchFolders,
  // Add the SDK package to watched folders
  require('path').resolve(__dirname, '../../packages/sdk'),
];

config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  require('path').resolve(__dirname, '../../node_modules'),
];

module.exports = config;