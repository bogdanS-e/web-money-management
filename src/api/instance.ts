import axios from 'axios';

import { refreshToken } from '@/api/auth';

export const instance = axios.create({
  baseURL: process.env.BASE_URL,
});

export const instanceS3 = axios.create({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    config.headers.authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error.response ? error.response.data.error : error);
    }

    return refreshToken()
      .then((token) => {
        const { config } = error;

        config.headers.authorization = `Bearer ${token}`;

        return axios.request(config);
      })
      .catch((refreshTokensError) => {
        return Promise.reject(refreshTokensError);
      });
  },
);
