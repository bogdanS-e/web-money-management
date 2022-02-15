import nextConnect from 'next-connect';
import DBClient from './DBClient';

async function database(req, _, next) {
  const client = await DBClient.getInstance();
  req.dbClient = client;
  if (!client) throw new Error('Client ERROOR');

  req.db = client.db('money-management');
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
