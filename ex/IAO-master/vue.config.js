// vue.config.js
module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_ROOT_URL
    : '/',
};
