import mongoose from 'mongoose';

const ExpenditureSchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  method: {
    type: String,
  },
  mfsTrxnId: {
    type: String,
  },
  paidTo: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: String
  },
  purpose: {
    type: mongoose.Schema.ObjectId,
    ref: 'Purpose',
  },
  createAt: {
    type: Date,
  },
});

ExpenditureSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'purpose',
    select: 'name',
  });
  next();
});

if (!mongoose.models.Expenditure) {
  mongoose.model('Expenditure', ExpenditureSchema);
}

export default mongoose.models.Expenditure;
