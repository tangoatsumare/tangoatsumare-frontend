module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // https://www.npmjs.com/package/react-native-dotenv
    plugins: [
      ['dotenv-import', {
        'moduleName': '@env',
        'path': '.env.local',
        'blacklist': null,
        'whitelist': null,
        'safe': false,
        'allowUndefined': false,
        }
      ],
      ['react-native-reanimated/plugin'],
   ]
  };
};
