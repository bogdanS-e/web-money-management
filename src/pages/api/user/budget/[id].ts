import nextConnect from 'next-connect';
import middleware from '../../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget } from '@/api/models/user';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.delete(async (req, res) => {
  try {
    const { id } = req.query as { id: string };
    
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

    //@ts-ignore
    await req.db.collection('budgets').deleteOne({ users: email, id });

    res.status(200).json({ id });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
