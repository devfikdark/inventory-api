import mongoose from 'mongoose';

const AdministratorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  sales: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Sale',
    },
  ],
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.Administrator) {
  mongoose.model('Administrator', AdministratorSchema);
}

export default mongoose.models.Administrator;
