import mongoose from 'mongoose';

const CustomerPaymentSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  amountPaid: {
    type: Number,
  },
  paymentMethod: {
    type: String,
  },
  mfsTrxId: {
    type: String,
  },
  sale: {
    type: mongoose.Schema.ObjectId,
    ref: 'Sale',
  },
});

if (!mongoose.models.CustomerPayment) {
  mongoose.model('CustomerPayment', CustomerPaymentSchema);
}

export default mongoose.models.CustomerPayment;
