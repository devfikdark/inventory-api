import mongoose from 'mongoose';

const CustomerHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
  },
});

if (!mongoose.models.CustomerHistory) {
  mongoose.model('CustomerHistory', CustomerHistorySchema);
}

export default mongoose.models.CustomerHistory;
