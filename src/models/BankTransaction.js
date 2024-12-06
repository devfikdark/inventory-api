import mongoose from 'mongoose';

const BankTransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  transactionType: {
    type: String,
  },
  bank: {
    type: String,
  },
  account: {
    type: String,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.BankTransaction) {
  mongoose.model('BankTransaction', BankTransactionSchema);
}

export default mongoose.models.BankTransaction;
