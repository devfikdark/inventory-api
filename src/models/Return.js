import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  returnAmount: {
    type: Number,
    default: 0,
  },
  reason: {
    type: String,
  },
  order: {
    type: String,
  },
  orderProduct: {
    type: mongoose.Schema.ObjectId,
    ref: 'OrderProduct',
  },
  transaction: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Transaction',
    }
  ],
  status: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createAt: {
    type: Date,
  },
  modifyBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  modifyAt: {
    type: Date,
  },
});

ReturnSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderProduct',
    select: '-product opId productName',
  }).populate({
    path: 'createdBy',
    select: 'fullName',
  });
  next();
});

if (!mongoose.models.Return) {
  mongoose.model('Return', ReturnSchema);
}

export default mongoose.models.Return;
