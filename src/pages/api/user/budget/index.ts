import nextConnect from 'next-connect';
import { v4 as uuid } from 'uuid';
import middleware from '../../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget } from '@/api/models/user';
import MoneyHistory from '@/mongo/moneyHistory';
import { IHistory } from '@/api/models/history';

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

    const budget: IBudget = {
      users: [email],
      amount,
      availableAmount: amount,
      categories: [],
      name,
      id,
      history: [],
    };

    const history = new MoneyHistory(null, budget, email) as IHistory;

    budget.history = [history];

    //@ts-ignore
    await req.db.collection('budgets').insertOne(budget);

    res.status(200).json(budget);

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
    const oldBudget = await req.db.collection('budgets').findOne({ users: email, id }, { projection: { _id: 0 } }) as IBudget;

    if (!oldBudget) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const budget = { ...oldBudget };
    const difference = budget.amount - amount;

    budget.availableAmount = budget.availableAmount - difference;
    budget.amount = amount;

    const history = new MoneyHistory(oldBudget, budget, email) as IHistory;

    budget.history.unshift(history);

    //@ts-ignore
    await req.db.collection('budgets').updateOne(
      { users: email, id },
      {
        $set: {
          history: budget.history,
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
