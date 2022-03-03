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
      name,
      id,
    });

    res.status(200).json({
      users: [email],
      amount,
      availableAmount: amount,
      name,
      id,
    });

  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
