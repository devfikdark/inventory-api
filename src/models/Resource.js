import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  roleResource: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'RoleResource',
    },
  ],
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.Resource) {
  mongoose.model('Resource', ResourceSchema);
}

export default mongoose.models.Resource;
