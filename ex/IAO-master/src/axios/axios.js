import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export default axios.create({
  baseURL: API_URL,
  withCredentials: true,
  crossDomain: true,
});

const axiosWithoutInterceptors = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  crossDomain: true,
});

export { API_URL, axiosWithoutInterceptors };