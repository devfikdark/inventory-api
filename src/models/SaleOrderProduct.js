import mongoose from 'mongoose';

const SaleOrderProductSchema = new mongoose.Schema({
  quantity: {
    type: Number,
  },
  singleProductProfit: {
    type: Number,
  },
  productName: {
    type: String,
  },
  unitPrice: {
    type: Number,
  },
  purchasePrice: {
    type: Number,
  },
  orderProduct: {
    type: mongoose.Schema.ObjectId,
    ref: 'OrderProduct',
  },
  sale: {
    type: mongoose.Schema.ObjectId,
    ref: 'Sale',
  },
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.SaleOrderProduct) {
  mongoose.model('SaleOrderProduct', SaleOrderProductSchema);
}

export default mongoose.models.SaleOrderProduct;
