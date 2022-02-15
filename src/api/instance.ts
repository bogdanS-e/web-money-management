import axios from 'axios';
import cookieCutter from 'cookie-cutter';

export const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = cookieCutter.get('access_token');

    config.headers.authorization = `${token}`;

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
      return Promise.reject(error);
    }

    const { config } = error;

    const token = cookieCutter.get('refresh_token');

    if (!token) return;

    return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token/?token=${token}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 401) {
          throw new Error('refresh error')
        }
      })
       .then((refreshJson) => {
        cookieCutter.set('access_token', refreshJson.accessToken);
        cookieCutter.set('refresh_token', refreshJson.refreshToken);

        config.headers.authorization = `${refreshJson.accessToken}`;

        return axios.request(config);
      })
      .catch(() => {
        cookieCutter.set('access_token', '', { expires: new Date(0) });
        cookieCutter.set('refresh_token', '', { expires: new Date(0) });
        window.location.replace('/');
      });
  },
);
