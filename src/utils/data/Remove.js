import mongoose from 'mongoose';
import CatchAsync from '../../middlewares/CatchAsync';

const RemoveData = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.remove()
  }

  res.json({
    message: 'ok',
  });
});

export default RemoveData;
