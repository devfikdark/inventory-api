import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  sellPrice: {
    type: Number,
  },
  image: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
  },
  modifyBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  modifyAt: [
    {
      type: Date,
    },
  ],
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
  },
  size: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Size',
    },
  ],
  productTag: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductTag',
    },
  ],
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tag',
    },
  ],
  orderProduct: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'OrderProduct',
    },
  ],
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'fullName',
  }).populate({
    path: 'brand',
    select: 'name',
  }).populate({
    path: 'size',
    select: 'name',
  }).populate({
    path: 'tags',
    select: 'name',
  });
  next();
});

if (!mongoose.models.Product) {
  mongoose.model('Product', ProductSchema);
}

export default mongoose.models.Product;
