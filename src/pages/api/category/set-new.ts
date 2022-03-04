import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { ISetCategoryRequest } from '@/api/models/category';
import { IBudget } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.post(async (req, res) => {
  try {
    //@ts-ignore
    const { email } = req.token;
    const { budgetId, categories } = req.body as ISetCategoryRequest;

    //@ts-ignore
    const budget = await req.db.collection('budgets').findOne({ users: email, id: budgetId }, { projection: { _id: 0 } }) as IBudget;

    if (!budget) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const { amount } = budget;
    const categoriesSum = categories.reduce((total, { amount }) => (total || 0) + (amount || 0), 0);

    budget.availableAmount = amount - categoriesSum;
    budget.categories = categories;

    // @ts-ignore
    await req.db.collection('budgets').updateOne(
      { users: email, id: budgetId },
      {
        $set: {
          availableAmount: budget.availableAmount,
          categories: budget.categories,
        },
        $unset: { code: '' },
      },
    );

    // @ts-ignore
    await req.db.collection('users').updateOne({ email }, { $set: { onboarded: true } });

    res.status(200).json(budget);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
