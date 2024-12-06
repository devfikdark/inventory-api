import mongoose from 'mongoose';

const SalaryHistorySchema = new mongoose.Schema({
  salaryMonth: {
    type: String,
  },
  salaryYear: {
    type: String,
  },
  date: {
    type: String,
  },
  amount: {
    type: Number,
  },
  salesAmount : {
    type: Number,
  },
  commission: {
    type: Number,
    default: 0,
  },
  method: {
    type: String,
  },
  mfsTrxnId: {
    type: String,
  },
  description: {
    type: String,
  },
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createAt: {
    type: Date,
  },
});

SalaryHistorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'staff',
    select: 'fullName contact',
  });
  next();
});

if (!mongoose.models.SalaryHistory) {
  mongoose.model('SalaryHistory', SalaryHistorySchema);
}

export default mongoose.models.SalaryHistory;
