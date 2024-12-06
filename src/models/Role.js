import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
  },
  roleResources: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'RoleResource',
    },
  ],
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.Role) {
  mongoose.model('Role', RoleSchema);
}

export default mongoose.models.Role;
