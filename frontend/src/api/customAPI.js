import axios from 'axios';

const customAxios = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', 
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

customAxios.defaults.withCredentials = true;

customAxios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default customAxios;