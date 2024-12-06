import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  productTag: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductTag',
    },
  ],
  createAt: {
    type: Date,
  },
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

if (!mongoose.models.Tag) {
  mongoose.model('Tag', TagSchema);
}

export default mongoose.models.Tag;
