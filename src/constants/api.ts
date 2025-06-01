import axios from 'axios';

let BASE_URL = 'http://192.168.0.1:5000/';
const api = axios.create({
  baseURL: BASE_URL,
});

export const setBaseUrl = (ip: string) => {
  const newUrl = `http://${ip}:5000/`;
  BASE_URL = newUrl;
  api.defaults.baseURL = newUrl;
};

export default api;