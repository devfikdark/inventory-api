import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  nationalId: {
    type: String,
  },
  basicSalary: {
    type: Number,
  },
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
  historys: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SalaryHistory',
    },
  ],
  createAt: {
    type: Date,
  },
});

// Query middleware
StaffSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -tokens',
  }).populate({
    path: 'sales',
    select: '-items totalBill',
  }).populate({
    path: 'historys',
    select: '-staff date amount salesAmount',
  });
  next();
});

if (!mongoose.models.Staff) {
  mongoose.model('Staff', StaffSchema);
}

export default mongoose.models.Staff;
