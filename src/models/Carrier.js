import mongoose from 'mongoose';

const CarrierSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  cell: {
    type: String,
  },
  organization: {
    type: String,
  },
  sale: {
    type: mongoose.Schema.ObjectId,
    ref: 'Sale',
  },
});

if (!mongoose.models.Carrier) {
  mongoose.model('Carrier', CarrierSchema);
}

export default mongoose.models.Carrier;
