import axios from 'axios';

require('dotenv').config();

const axiosInstance = axios.create({
  baseURL: process.env.CORE_SERVER_URL,
  timeout: Number(process.env.HTTP_TIMEOUT),
  maxRedirects: Number(process.env.HTTP_MAX_REDIRECTS),
});

export default axiosInstance;
