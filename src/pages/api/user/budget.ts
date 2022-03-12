import nextConnect from 'next-connect';
import { v4 as uuid } from 'uuid';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.post(async (req, res) => {
  try {
    const { amount, name } = req.body as IBudget;

    if (typeof amount !== 'number') {
      res.status(400).json({
        message: 'Must contain only numbers',
      });

      return;
    }

    //@ts-ignore
    const { email } = req.token;
    const id = uuid();

    //@ts-ignore
    await req.db.collection('budgets').insertOne({
      users: [email],
      amount,
      availableAmount: amount,
      categories: [],
      name,
      id,
    });

    res.status(200).json({
      users: [email],
      amount,
      availableAmount: amount,
      categories: [],
      name,
      id,
    });

  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

handler.patch(async (req, res) => {
  try {
    const { amount, id } = req.body as { id: string, amount: number };

    if (typeof amount !== 'number') {
      res.status(400).json({
        message: 'Must contain only numbers',
      });

      return;
    }

    //@ts-ignore
    const { email } = req.token;

    //@ts-ignore
    const budget = await req.db.collection('budgets').findOne({ users: email, id }, { projection: { _id: 0 } }) as IBudget;

    if (!budget) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const difference = budget.amount - amount;

    budget.availableAmount = budget.availableAmount - difference;
    budget.amount = amount;

    //@ts-ignore
    await req.db.collection('budgets').updateOne(
      { users: email, id },
      {
        $set: {
          amount: budget.amount,
          availableAmount: budget.availableAmount,
        }
      },
    );

    res.status(200).json(budget);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
