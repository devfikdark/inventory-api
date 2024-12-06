import mongoose from 'mongoose';

const OrderProductSchema = new mongoose.Schema({
  opId: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  purchasePrice: {
    type: Number,
  },
  mfgDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  barCodeUrl: {
    type: String,
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  productName: {
    type: String,
  },
  createAt: {
    type: Date,
  },
});
 
OrderProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: 'name sellPrice image',
  });
  next();
});

if (!mongoose.models.OrderProduct) {
  mongoose.model('OrderProduct', OrderProductSchema);
}

export default mongoose.models.OrderProduct;
