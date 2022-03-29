import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget, IMoneyBox, IShareBudgetRequest } from '@/api/models/user';
import emailClient from '@/mongo/emailClient';
import MoneyHistory from '@/mongo/moneyHistory';
import { IHistory } from '@/api/models/history';

const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.post(async (req, res) => {
  try {
    const { id, emails, message } = req.body as IShareBudgetRequest;

    //@ts-ignore
    const { email } = req.token;

    //@ts-ignore
    const oldBox = await req.db.collection('money-boxes').findOne({ users: email, id }, { projection: { _id: 0 } }) as IMoneyBox;

    if (!oldBox) {
      res.status(404).json({
        message: 'budget was not found',
      });

      return;
    }

    const box = Object.assign({}, oldBox);
    box.users = [...oldBox.users];
    box.users.push(...emails);

    
    //@ts-ignore
    await req.db.collection('money-boxes').updateOne(
      { id },
      {
        $set: {
          users: box.users,
        }
      },
    );

    const origin = req.headers.origin;

    if (!origin) throw new Error('no origin provided');

    await emailClient.sendMail({
      from: process.env.MAIL_ID,
      to: emails,
      subject: `User ${email} shared a money box with you`,
      text: `User ${email} shared a money box with you`,
      html: `${message}<br><p>Follow the <a href='${origin}/'>link</a> to see shared money box`,
    });

    res.status(200).json(box);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
