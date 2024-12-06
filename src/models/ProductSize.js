import mongoose from 'mongoose';

const ProductSizeSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  size: {
    type: mongoose.Schema.ObjectId,
    ref: 'Size',
  },
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.ProductSize) {
  mongoose.model('ProductSize', ProductSizeSchema);
}

export default mongoose.models.ProductSize;
