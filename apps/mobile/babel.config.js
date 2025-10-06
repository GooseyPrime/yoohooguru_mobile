module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './app',
            '@/components': './components',
            '@/hooks': './hooks',
            '@/lib': './lib',
            '@/types': './types',
          },
        },
      ],
    ],
  };
};