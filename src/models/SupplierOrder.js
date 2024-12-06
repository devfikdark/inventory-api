import mongoose from 'mongoose';

const SupplierOrderSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.SupplierOrder) {
  mongoose.model('SupplierOrder', SupplierOrderSchema);
}

export default mongoose.models.SupplierOrder;
