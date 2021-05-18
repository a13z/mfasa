import axios from 'axios';

// const isBrowser = typeof window !== 'undefined' && window;

// Check if window is defined (so if in the browser or in node.js).
const isBrowser = typeof window !== 'undefined';

class Request {
  constructor() {
    this.initConfig();
  }

  initConfig() {
    const baseURL = `${process.env.GATSBY_BACKEND_BASEURL}`;
    axios.defaults.baseURL = baseURL;
    if (isBrowser) {
      this.setAuthHeader(window.localStorage.getItem('token'));
    }

    axios.interceptors.response.use((response) => ({
      ...response,
      data: response.data,
    }), (error) => Promise.reject(this.parseError(error)));
  }

  setAuthHeader(token) {
    if (token) axios.defaults.headers.common.Authorization = `JWT ${token}`;
  }

  setAuthToken(token) {
    if (isBrowser) {
      window.localStorage.token = token;
    }
    this.setAuthHeader(token);
  }

  isLoggedIn() {
    if (isBrowser) {
      return window.localStorage.getItem('token');
    }
  }

  clearAuthToken() {
    if (isBrowser) {
      delete window.localStorage.token;
    }
    delete axios.defaults.headers.common.Authorization;
  }

  parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // parseJwt(token) {
  //   console.log('parseJwt');
  //   console.log(token);
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  //   console.log(JSON.parse(jsonPayload));

  //   return JSON.parse(jsonPayload);
  // }

  parseError(error) {
    const { response = {} } = error;

    return {
      ...error,
      response: {
        ...response,
        data: {
          ...response.data,
          _error: response.data ? response.data.non_field_errors : [],
        },
      },
    };
  }

  get(...args) {
    return axios.get(...args);
  }

  post(...args) {
    return axios.post(...args);
  }

  options(...args) {
    return axios.options(...args);
  }

  patch(...args) {
    return axios.patch(...args);
  }

  put(...args) {
    return axios.put(...args);
  }

  delete(...args) {
    return axios.delete(...args);
  }
}

export default new Request();
