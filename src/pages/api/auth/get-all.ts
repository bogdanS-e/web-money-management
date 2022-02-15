import nextConnect from 'next-connect';

import middleware from '../../../mongo/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    // @ts-ignore
    const users = await req.db.collection('users').find().toArray();

    console.log(users);
    
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    
    res.status(500).json(e);
  }
});

export default handler;
