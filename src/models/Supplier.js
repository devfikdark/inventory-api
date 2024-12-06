import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  orders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
    },
  ],
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.Supplier) {
  mongoose.model('Supplier', SupplierSchema);
}

export default mongoose.models.Supplier;
