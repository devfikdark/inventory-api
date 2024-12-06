import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createAt: {
    type: Date,
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
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

if (!mongoose.models.Brand) {
  mongoose.model('Brand', BrandSchema);
}

export default mongoose.models.Brand;
