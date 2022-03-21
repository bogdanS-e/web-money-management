import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IIncrementCategory } from '@/api/models/category';
import { IBudget } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.patch(async (req, res) => {
  try {
    //@ts-ignore
    const { email } = req.token;
    const { id, amount, budgetId } = req.body as IIncrementCategory;

    //@ts-ignore
    const budget = await req.db.collection('budgets').findOne({ users: email, id: budgetId }, { projection: { _id: 0 } }) as IBudget;

    if (!budget) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const category = budget.categories.find((category) => category.id === id)

    if (!category) {
      res.status(404).json({
        message: 'category was not found',
      });

      return;
    }

    budget.amount = budget.amount - amount;
    category.amount = category.amount! - amount;

    // @ts-ignore
    await req.db.collection('budgets').updateOne(
      { users: email, id: budgetId },
      {
        $set: {
          amount: budget.amount,
          categories: budget.categories,
        },
        $unset: { code: '' },
      },
    );

    res.status(200).json(budget);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
