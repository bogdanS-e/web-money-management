import { IConfirmSignUpRequest } from '@/api/models/user';
import { getTokenPair } from '@/mongo/jwtProvider';
import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  try {
    const { email, code } = req.body as IConfirmSignUpRequest;

    // @ts-ignore
    const user = await req.db.collection('users').findOne({ email });

    if (!user) {
      res.status(400).json({
        message: `User ${email} was not found`,
      });

      return;
    }

    if (user.isVerificated) {
      res.status(400).json({
        message: `User ${email} has already been verificated`,
      });

      return;
    }

    if (code != user.code) {
      res.status(400).json({
        message: `Provided code didn't match. Try again`,
      });

      return;
    }

    // @ts-ignore
    await req.db.collection('users').updateOne(
      { email },
      {
        $set: { isVerificated: true },
        $unset: { code: '' },
      },
    );


    res.status(200).json({
      ...getTokenPair({ email }),
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

export default handler;
