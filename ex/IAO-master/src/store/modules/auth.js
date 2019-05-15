/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import axios, { axiosWithoutInterceptors } from '@/axios/axios';
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  NO_AUTH,
  AUTH_CHECK,
} from '../actions/auth';
import { SET_USERNAME, SET_USERROLE, SET_TIMER } from '../actions/user';

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false,
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
};

const actions = {
  [AUTH_REQUEST]: ({ commit }, user) => new Promise((resolve, reject) => {
    commit(AUTH_REQUEST);
    axiosWithoutInterceptors.post('authorization/login', user)
      .then((resp) => {
        localStorage.setItem('user-token', resp.data.token);
        axios.defaults.headers.common.Cookie = `JSESSIONID=${resp.data.token}`;
        commit(AUTH_SUCCESS, resp.data);
        commit(SET_USERNAME, resp.data.username);
        commit(SET_USERROLE, resp.data.role);
        commit(SET_TIMER, resp.data.timer);
        resolve(resp);
      })
      .catch((err) => {
        commit(AUTH_ERROR, err);
        localStorage.removeItem('user-token');
        reject(err);
      });
  }),
  [AUTH_LOGOUT]: ({ commit }) => new Promise((resolve) => {
    axiosWithoutInterceptors.post('authorization/logout', {})
      .then(() => {
        commit(AUTH_LOGOUT);
        localStorage.clear();
        resolve();
      })
      .catch(err => err);
  }),
  [NO_AUTH]: ({ commit }) => new Promise((resolve) => {
    commit(AUTH_LOGOUT);
    localStorage.clear();
    resolve();
  }),
  [AUTH_CHECK]: ({ commit, state }) => new Promise((resolve) => {
    if (state.status) {
      axios.post('/authorization/login_get', { relive: true })
        .then((resp) => {
          localStorage.setItem('user-token', resp.data.token);
          axios.defaults.headers.common.Cookie = `JSESSIONID=${resp.data.token}`;
          commit(AUTH_SUCCESS, resp.data);
          commit(SET_USERNAME, resp.data.username);
          commit(SET_USERROLE, resp.data.role);
          commit(SET_TIMER, resp.data.timer);
          resolve(resp);
        })
        .catch(err => err);
    }
  }),
};

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success';
    state.token = resp.token;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error';
    state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = '';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
