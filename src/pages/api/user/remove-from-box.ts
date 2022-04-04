import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';
import protectedRoute from '@/mongo/jwtProvider';
import { IBudget, IRemoveUserFromBoxRequest } from '@/api/models/user';


const handler = nextConnect();

handler.use(middleware);
handler.use(protectedRoute);

handler.patch(async (req, res) => {
  try {
    const { boxId, email: emailToDelete } = req.body as IRemoveUserFromBoxRequest;

    //@ts-ignore
    const { email } = req.token;
    
    //@ts-ignore
    const olbBox = await req.db.collection('money-boxes').findOne({ users: email, id: boxId }, { projection: { _id: 0 } }) as IBudget;

    if (!olbBox) {
      res.status(404).json({
        message: 'box was not found',
      });

      return;
    }

    const index = olbBox.users.indexOf(emailToDelete);

    if (index === -1) {
      throw new Error('no email found');
    }

    const box = { ...olbBox };
    box.users = [...olbBox.users];
    box.users.splice(index, 1);

    //@ts-ignore
    await req.db.collection('money-boxes').updateOne(
      { id: boxId },
      {
        $set: {
          users: box.users,
        }
      },
    );

    res.status(200).json(box);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
