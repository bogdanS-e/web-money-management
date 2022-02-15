import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import generateCode from '@/utils/generateCode';
import emailClient from '@/mongo/emailClient';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      res.status(400);

      return;
    }

    // @ts-ignore
    const user = await req.db.collection('users').findOne({ email });

    if (!user) {
      res.status(400).json({
        message: `User ${email} was not found`,
      });

      return;
    }

    const veryficationCode = generateCode();
    const origin = req.headers.origin;

    // @ts-ignore
    await req.db.collection('users').updateOne({ email }, { $set: { code: veryficationCode } });

    await emailClient.sendMail({
      from: process.env.MAIL_ID,
      to: email,
      subject: "Sign Up Web management",
      text: "Hello",
      html: `<p>Follow the <a href='${origin}/confirm-sign-up?email=${email}&code=${veryficationCode}'>link</a> or enter the code manually: ${veryficationCode}`,
    });

    res.status(200).json({ email, code: veryficationCode });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

export default handler;
