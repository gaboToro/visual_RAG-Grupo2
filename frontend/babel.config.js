/**
 * @file babel.config.js
 * @description Configuración de Babel para el proyecto React Native administrado por Expo.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
