import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IUser } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.get(async (req, res) => {
  try {

    //@ts-ignore
    const { email } = req.token;

    //@ts-ignore
    const user = await req.db.collection('users').findOne({ email }) as IUser;
    let link = 'https://t.me/diplom_money_bot';

    if (!user.chatId) {
      link = link + `?start=${user._id.toString()}`  
    }
    
    if (!user) {
      res.status(404).json({
        message: `user ${email} was not found`,
      });

      return;
    }

    res.status(200).json({
      link
    });

  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
