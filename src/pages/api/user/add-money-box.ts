import nextConnect from 'next-connect';
import { v4 as uuid } from 'uuid';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { ICreateMoneyBoxRequest, IMoneyBox } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.post(async (req, res) => {
  try {
    const { goal, name, date } = req.body as ICreateMoneyBoxRequest;
    const editDate = new Date();
    const goalDate = new Date(date);

    if (typeof goal !== 'number') {
      res.status(400).json({
        message: 'Must contain only numbers',
      });

      return;
    }

    //@ts-ignore
    const { email } = req.token;
    const id = uuid();

    const box: IMoneyBox = {
      users: [email],
      goal,
      startDate: editDate.toISOString(),
      goalDate: goalDate.toISOString(),
      actualAmount: 0,
      name,
      id,
      completed: false,
      image: null,
    };

    //@ts-ignore
    await req.db.collection('money-boxes').insertOne(box);

    res.status(200).json(box);

  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
