import mongoose from 'mongoose';

export default async function connect() {
  if(!process.env.MONGO_URL) throw new Error('ENV ERROOR');

  await mongoose.connect(process.env.MONGO_URL, {});
}
