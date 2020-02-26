import axios from 'axios';
import AuthService from './common/services/auth.service';
import { push as routerPush } from 'react-router-redux';

const { REACT_APP_API_HOST, REACT_APP_API_PORT } = process.env;
const PROTOCOL = window.location.protocol;
axios.defaults.baseURL = `${PROTOCOL}//${REACT_APP_API_HOST}:${REACT_APP_API_PORT}`;

axios.interceptors.request.use(
  config => {
    if (AuthService.isAuth) {
      config.headers.common['Authorization'] = 'Bearer ' + AuthService.accessToken;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      AuthService.logout();
      routerPush('/login');
    }

    return Promise.reject(error);
  },
);
