import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget, IRemoveUserFromBudgetRequest } from '@/api/models/user';
import { IHistory } from '@/api/models/history';
import MoneyHistory from '@/mongo/moneyHistory';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.patch(async (req, res) => {
  try {
    const { budgetId, email: emailToDelete } = req.body as IRemoveUserFromBudgetRequest;

    //@ts-ignore
    const { email } = req.token;
    //@ts-ignore
    const app = req.app;
    
    //@ts-ignore
    const oldBudget = await req.db.collection('budgets').findOne({ users: email, id: budgetId }, { projection: { _id: 0 } }) as IBudget;

    if (!oldBudget) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const index = oldBudget.users.indexOf(emailToDelete);

    if (index === -1) {
      throw new Error('no email found');
    }

    const budget = { ...oldBudget };
    budget.users = [...oldBudget.users];
    budget.users.splice(index, 1);

    const history = new MoneyHistory(oldBudget, budget, email) as IHistory;
    budget.history.unshift(history);

    //@ts-ignore
    await req.db.collection('budgets').updateOne(
      { id: budgetId },
      {
        $set: {
          history: budget.history,
          users: budget.users,
          app,
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
