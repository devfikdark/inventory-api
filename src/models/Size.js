import mongoose from 'mongoose';

const SizeSchema = new mongoose.Schema({
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

if (!mongoose.models.Size) {
  mongoose.model('Size', SizeSchema);
}

export default mongoose.models.Size;
