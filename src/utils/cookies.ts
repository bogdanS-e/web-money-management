const EXPIRATION_PERIOD = 3650;

interface Cookies {
  [key: string]: string
}

const setCookie = (name: string, value: string) => {
  const cookies = getParsedCookies();
  cookies[name] = value;

  clearCookie();

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + EXPIRATION_PERIOD);

  Object.entries(cookies).map(([name, value]) => {
    document.cookie = `${name}=${value}; path=/; expires=${expirationDate.toUTCString()}; SameSite=None; Secure`;
  });
};

const getCookie = (name: string) => {
  return getParsedCookies()[name];
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};

const clearCookie = () => {
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, `=; path=/; expires=${new Date().toUTCString()};`);
  });
};

const getParsedCookies = (): Cookies => {
  const cookies = {};

  const entries = document.cookie.split(';');

  entries.forEach((entry) => {
    const name = entry.substr(0, entry.indexOf('=')).replace(/^\s+|\s+$/g, '');
    const value = unescape(entry.substr(entry.indexOf('=') + 1));

    cookies[name] = value;
  });

  return cookies;
};

export {
  setCookie,
  getCookie,
  removeCookie,
  clearCookie,
};
