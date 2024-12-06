import mongoose from 'mongoose';

const ProductTagSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  tag: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tag',
  },
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.ProductTag) {
  mongoose.model('ProductTag', ProductTagSchema);
}

export default mongoose.models.ProductTag;
