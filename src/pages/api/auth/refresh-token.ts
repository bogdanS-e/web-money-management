import nextConnect from 'next-connect';
import jwt from 'jsonwebtoken';

import { getTokenPair, REFRESH_SECRET } from '@/mongo/jwtProvider';

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      res.status(401).send('');
      return;
    }

    jwt.verify(token as string, REFRESH_SECRET, (err, success) => {
      if (err) {
        res.status(401).send('');
        return;
      }
      //@ts-ignore
      const { email } = success

      if (email) {
        res.status(200).json({
          ...getTokenPair({ email }),
        });
      }
    });

  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

export default handler;
