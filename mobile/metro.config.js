const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for SVG files
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg', 'cjs', 'mjs');

// Enable CSS support for web
config.resolver.sourceExts.push('css');

module.exports = config;
