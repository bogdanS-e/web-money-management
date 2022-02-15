import axios from 'axios';
import cookieCutter from 'cookie-cutter';

export const instance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000/api',
});

instance.interceptors.request.use(
  (config) => {
    //cookieCutter.set('refresh_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVmYm16YWtvZGJta3l0cnhpZkBrdmhyci5jb20iLCJpYXQiOjE2NDQ4NDU4NzYsImV4cCI6MTY0NTcwOTg3Nn0.58VW0aUOvTsbjCHUj4qvKb5bDauC82u48tRvBD7QQL8');
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

    fetch(`http://localhost:3000/api/auth/refresh-token/?token=${token}`)
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

        config.headers.authorization = `${token}`;

        return axios.request(config);
      })
      .catch(() => {
        window.location.replace('/');
      });
  },
);
