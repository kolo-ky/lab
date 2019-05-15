import auth from '@/store/modules/auth';
import user from '@/store/modules/user';
import preLoad from '@/store/modules/preLoad';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    auth,
    user,
    preLoad,
  },
  strict: debug,
});

export default store;
