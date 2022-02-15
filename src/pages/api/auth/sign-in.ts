import { ICreateUserRequest } from '@/api/models/user';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import middleware from '../../../mongo/database';
import generateCode from '@/utils/generateCode';
import emailClient from '@/mongo/emailClient';
import { getTokenPair } from '@/mongo/jwtProvider';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  try {
    const { email, password } = req.body as ICreateUserRequest;

    // @ts-ignore
    const user = await req.db.collection('users').findOne({ email });

    if (!user) {
      res.status(400).json({
        message: `User ${email} was not found`,
      });

      return;
    }

    if (!user.isVerificated) {
      const veryficationCode = generateCode();
      const origin = req.headers.origin;

      if (!origin) throw new Error('no origin provided');

      await emailClient.sendMail({
        from: process.env.MAIL_ID,
        to: email,
        subject: "Sign Up Web management",
        text: "Hello",
        html: `<p>Follow the <a href='${origin}/confirm-sign-up?email=${email}&code=${veryficationCode}'>link</a>`,
      });

      res.status(302).json({
        message: `User ${email} is not verificated. Check your email for instructions`,
      });

      return;
    }

    const isMatchPasswords = await bcrypt.compare(password, user.password);

    if (!isMatchPasswords) {
      res.status(400).json({
        message: `Incorect email or password`,
      });

      return;
    }

    res.status(200).json({
      ...getTokenPair({ email }),
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

export default handler;
