import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget, IRemoveUserFromBudgetRequest } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.patch(async (req, res) => {
  try {
    const {budgetId, email} = req.body as IRemoveUserFromBudgetRequest;

    //@ts-ignore
    const budget = await req.db.collection('budgets').findOne({ users: email, id: budgetId }, { projection: { _id: 0 } }) as IBudget;

    if (!budget) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const index = budget.users.indexOf(email);

    if (index === -1) {
      throw new Error('no email found');
    }

    budget.users.splice(index, 1);

    //@ts-ignore
    await req.db.collection('budgets').updateOne(
      { id: budgetId },
      {
        $set: {
          users: budget.users,
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
