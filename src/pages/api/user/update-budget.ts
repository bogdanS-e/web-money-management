import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget } from '@/api/models/user';
import MoneyHistory from '@/mongo/moneyHistory';
import { IHistory } from '@/api/models/history';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.patch(async (req, res) => {
  try {
    const budgetToUpdate = req.body as Partial<IBudget> & { id: string };

    //@ts-ignore
    const { email } = req.token;
    //@ts-ignore
    const app = req.app;

    //@ts-ignore
    const budget = await req.db.collection('budgets').findOne({ users: email, id: budgetToUpdate.id }, { projection: { _id: 0 } }) as IBudget;

    if (!budget) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const newBudget = { ...budget, ...budgetToUpdate };

    const history = new MoneyHistory(budget, newBudget, email) as IHistory;
    newBudget.history.unshift(history);

    //@ts-ignore
    await req.db.collection('budgets').replaceOne(
      { users: email, id: newBudget.id },
      { ...newBudget, app },
    );

    res.status(200).json(newBudget);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
