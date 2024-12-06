import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  buyingAmount: {
    type: Number,
    default: 0,
  },
  customerType: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  cardNum: {
    type: String,
  },
  cardIssueDate: {
    type: Date,
  },
  history: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'CustomerHistory',
    },
  ],
  createAt: {
    type: Date,
  },
});

CustomerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'history',
    select: 'date amount',
  });
  next();
});

if (!mongoose.models.Customer) {
  mongoose.model('Customer', CustomerSchema);
}

export default mongoose.models.Customer;
