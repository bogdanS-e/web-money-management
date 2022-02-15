import { ICreateUserRequest } from '@/api/models/user';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import middleware from '../../../mongo/database';
import generateCode from '@/utils/generateCode';
import emailClient from '@/mongo/emailClient';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  try {
    const { email, password } = req.body as ICreateUserRequest;

    if (password.length < 8) {
      res.status(400).json({
        message: 'Must contain at least 8 characters',
      });

      return;
    }

    // @ts-ignore
    const users = await req.db.collection('users').find({ email }).toArray();

    if (!users.length) {
      const hash = await bcrypt.hash(password, 10);
      const veryficationCode = generateCode();
      const origin = req.headers.origin;

      if (!origin) throw new Error('no origin provided');

      // @ts-ignore
      await req.db.collection('users').insertOne({
        ...req.body,
        password: hash,
        code: veryficationCode,
        isVerificated: false,
      });

      await emailClient.sendMail({
        from: process.env.MAIL_ID,
        to: email,
        subject: "Sign Up Web management",
        text: "Hello",
        html: `<p>Follow the <a href='${origin}/confirm-sign-up?email=${email}&code=${veryficationCode}'>link</a> or enter the code manually: ${veryficationCode}`,
      });

      res.status(200).json({ email, code: veryficationCode });

      return;
    }

    res.status(400).json({
      message: `Email ${email} already exists`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

export default handler;
