import { ICreateUserRequest } from '@/api/models/user';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import middleware from '../../../mongo/database';
import generateCode from '@/utils/generateCode';
import emailClient from '@/mongo/emailClient';
import Cookies from 'cookies';
import protectedRoute from '@/mongo/jwtProvider';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.get(async (req, res) => {
  try {

    //@ts-ignore
    const { email } = req.token;

    //@ts-ignore
    const user = await req.db.collection('users').findOne({ email });

    if (!user) {
      res.status(404).json({
        message: `user ${email} was not found`,
      });

      return;
    }

    const { name, email: userEmail } = user;

    res.status(200).json({ name, email: userEmail });

  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
