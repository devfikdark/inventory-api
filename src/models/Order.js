import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  totalBill: {
    type: Number,
    default: 0,
  },
  totalDue: {
    type: Number,
    default: 0,
  },
  totalRefund: {
    type: Number,
    default: 0,
  },
  expectedRefund: {
    type: Number,
    default: 0,
  },
  orderProduct: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'OrderProduct',
    },
  ],
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
  },
  transactions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Transaction',
    },
  ],
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
    select: false,
  },
  modifyAt: {
    type: Date,
    select: false,
  },
});

OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'supplier',
    select: 'name contact',
  }).populate({
    path: 'createdBy',
    select: 'fullName',
  }).populate({
    path: 'orderProduct',
    select: '-order -product',
  }).populate({
    path: 'transactions',
    select: 'date amount method isRefund',
  });
  next();
});

if (!mongoose.models.Order) {
  mongoose.model('Order', OrderSchema);
}

export default mongoose.models.Order;
