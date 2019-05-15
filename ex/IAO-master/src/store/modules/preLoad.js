/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import SHOW_PRELOAD from '@/store/actions/preLoad';

const state = {
  showPreLoad: false,
};

const getters = {
  isShowPreLoad: state => !!state.showPreLoad,
};

const actions = {
  [SHOW_PRELOAD]: ({ commit }) => {
    commit(SHOW_PRELOAD);
  },
};

const mutations = {
  [SHOW_PRELOAD]: (state) => {
    state.showPreLoad = !state.showPreLoad;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
