import { instance } from './instance';

export const generateLinkToTelegram = () => {
  return instance.get('/telegram/link');
};
