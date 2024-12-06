import mongoose from 'mongoose';

const PurposeSchema = new mongoose.Schema({
  name: {
    type: String,
  }
});

if (!mongoose.models.Purpose) {
  mongoose.model('Purpose', PurposeSchema);
}

export default mongoose.models.Purpose;
