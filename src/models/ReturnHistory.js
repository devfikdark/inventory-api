import mongoose from 'mongoose';

const ReturnHistorySchema = new mongoose.Schema({
  customerName: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  customerType: {
    type: String,
  },
  InvoiceNum: {
    type: String,
  },
  productName: {
    type: String,
  },
  unitPrice: {
    type: Number,
  },
  totalReturnPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createAt: {
    type: Date,
  },
});

ReturnHistorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'fullName',
  });
  next();
});

if (!mongoose.models.ReturnHistory) {
  mongoose.model('ReturnHistory', ReturnHistorySchema);
}

export default mongoose.models.ReturnHistory;
