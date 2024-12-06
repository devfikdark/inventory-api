import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  primaryBill: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  taxPercent: {
    type: Number,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
  },
  mfsTrxId: {
    type: String,
  },
  initialPayment: {
    type: Number,
    default: 0,
  },
  totalBill: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
  InvoiceNum: {
    type: String,
  },
  isComplete: {
    type: Boolean,
  },
  isModify: {
    type: Boolean,
    default: false,
  },
  requiresDelivery: {
    type: Boolean,
  },
  shippingStatus: {
    type: String,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  deliveryAddress: {
    type: String,
  },
  type: {
    type: Boolean,
    default: true,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  carrier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Carrier',
  },
  items: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SaleOrderProduct',
    },
  ],
  opList: [
    {
      type: String,
    },
  ],
  payments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'CustomerPayment',
    },
  ],
  createAt: {
    type: Date,
  },
});

SaleSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    select: 'quantity singleProductProfit productName unitPrice purchasePrice',
  }).populate({
    path: 'seller',
    select: 'fullName contact',
  }).populate({
    path: 'customer',
    select: '-history customerName mobileNumber customerType',
  }).populate({
    path: 'carrier',
    select: '-sale',
  }).populate({
    path: 'payments',
    select: '-sale',
  });
  next();
});

if (!mongoose.models.Sale) {
  mongoose.model('Sale', SaleSchema);
}

export default mongoose.models.Sale;
