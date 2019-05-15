/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { SET_USERNAME, SET_USERROLE, SET_TIMER } from '../actions/user';

const state = {
  role: localStorage.getItem('role') || '',
  username: localStorage.getItem('username') || '',
  timer: localStorage.getItem('timer') || '1000000',
};

const getters = {
  getUsername: state => state.username,
  getUserRole: state => state.role,
  getTimer: state => state.timer,
};

const actions = {
  [SET_USERNAME]: ({ commit }, username) => {
    commit(SET_USERNAME, username);
  },
  [SET_USERROLE]: ({ commit }, role) => {
    commit(SET_USERROLE, role);
  },
  [SET_TIMER]: ({ commit }, timer) => {
    commit(SET_TIMER, timer);
  },
};

const mutations = {
  [SET_USERNAME]: (state, username) => {
    state.username = username;
    localStorage.setItem('username', username);
  },
  [SET_USERROLE]: (state, role) => {
    state.role = role;
    localStorage.setItem('role', role);
  },
  [SET_TIMER]: (state, timer) => {
    if (!timer) {
      state.timer = 100000;
      localStorage.setItem('timer', 100000);
    } else {
      state.timer = timer;
      localStorage.setItem('timer', timer);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
