import store from '@/store/index';
import App from '@/App.vue';
import router from '@/router';
import Vue from 'vue';
import axios from './axios/axios';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

// polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
