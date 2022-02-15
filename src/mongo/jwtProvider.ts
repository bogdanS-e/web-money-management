import { IUserTokens } from '@/api/models/user';
import jwt from 'jsonwebtoken';
import nextConnect, { IncomingMessage, NextHandler, ServerResponse } from 'next-connect';

const ACCESS_EXPIRATION = '1h';
const REFRESH_EXPIRATION = '10days';

export const ACCESS_SECRET = 'some-access-secret-goes-here';
export const REFRESH_SECRET = 'some-refresh-secret-goes-here';

export function getTokenPair(data: object): IUserTokens {
  const accessToken = jwt.sign(data, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRATION });
  const refreshToken = jwt.sign(data, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRATION });

  return {
    accessToken,
    refreshToken,
  }
};

function protectedRoute(req: IncomingMessage, res: ServerResponse, next: NextHandler) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send('');
    return;
  }

  jwt.verify(token, ACCESS_SECRET, (err, email) => {
    if (err) {
      res.status(401).send('');
      return;
    }

    //@ts-ignore
    req.token = email;

    next();
  });
};

const middleware = nextConnect();

middleware.use(protectedRoute);

export default middleware;
