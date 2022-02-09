import { MongoClient } from 'mongodb';

class DBClient {
  private static instance: MongoClient;

  public static async getInstance() {
    if (this.instance) return this.instance;

    if(!process.env.MONGO_URL) throw new Error('ENV ERROOR');;

    const client = new MongoClient(process.env.MONGO_URL, {});

    await client.connect();

    this.instance = client;

    return this.instance;
  }
}

export default DBClient;
