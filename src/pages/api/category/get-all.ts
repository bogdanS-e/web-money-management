import nextConnect from 'next-connect';
import middleware from '../../../mongo/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    //@ts-ignore
    const categories = await req.db.collection('categories').find({}, { projection: { _id: 0 } }).toArray();
    
    res.status(200).json(categories);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

export default handler;
