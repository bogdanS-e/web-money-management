import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget, IShareBudgetRequest } from '@/api/models/user';
import emailClient from '@/mongo/emailClient';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.post(async (req, res) => {
  try {
    const { id, emails, message } = req.body as IShareBudgetRequest;

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

    budget.users.push(...emails);

    //@ts-ignore
    await req.db.collection('budgets').updateOne(
      { id },
      {
        $set: {
          users: budget.users,
        }
      },
    );

    const origin = req.headers.origin;

    if (!origin) throw new Error('no origin provided');

    await emailClient.sendMail({
      from: process.env.MAIL_ID,
      to: emails,
      subject: `User ${email} shared a budget with you`,
      text: `User ${email} shared a budget with you`,
      html: `${message}<br><p>Follow the <a href='${origin}/'>link</a> to see shared budget`,
    });

    res.status(200).json(budget);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
