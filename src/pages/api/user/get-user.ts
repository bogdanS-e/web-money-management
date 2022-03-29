import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
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

    const { name, onboarded, email: userEmail } = user;

    //@ts-ignore
    const budgets = await req.db.collection('budgets').find({ users: userEmail }, { projection: { _id: 0 } }).toArray();
    //@ts-ignore
    const moneyBoxes = await req.db.collection('money-boxes').find({ users: userEmail }, { projection: { _id: 0 } }).toArray();

    res.status(200).json({
      name,
      onboarded,
      email: userEmail,
      budgets,
      moneyBoxes,
    });

  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
