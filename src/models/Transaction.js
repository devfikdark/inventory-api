import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  method: {
    type: String,
  },
  mfsTrxnId: {
    type: String,
  },
  isRefund: {
    type: Boolean,
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
  return: {
    type: mongoose.Schema.ObjectId,
    ref: 'Return',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createAt: {
    type: Date,
  },
});

TransactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'order',
    select: '-transactions -orderProduct name date',
  }).populate({
    path: 'createdBy',
    select: 'fullName',
  });
  next();
});

if (!mongoose.models.Transaction) {
  mongoose.model('Transaction', TransactionSchema);
}

export default mongoose.models.Transaction;
