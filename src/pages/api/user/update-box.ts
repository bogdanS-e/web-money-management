import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget, IMoneyBox } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.patch(async (req, res) => {
  try {
    const boxToUpdate = req.body as Partial<IMoneyBox> & { id: string };

    //@ts-ignore
    const { email } = req.token;

    //@ts-ignore
    const box = await req.db.collection('money-boxes').findOne({ users: email, id: boxToUpdate.id }, { projection: { _id: 0 } }) as IMoneyBox;

    if (!box) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const newBudget = { ...box, ...boxToUpdate };

    if (newBudget.actualAmount >= newBudget.goal) {
      newBudget.completed = true;
    }

    //@ts-ignore
    await req.db.collection('money-boxes').replaceOne(
      { users: email, id: newBudget.id },
      { ...newBudget },
    );

    res.status(200).json(newBudget);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
