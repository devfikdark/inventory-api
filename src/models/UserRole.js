import mongoose from 'mongoose';

const UserRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  role: {
    type: mongoose.Schema.ObjectId,
    ref: 'Role',
  },
  createAt: {
    type: Date,
  },
});

if (!mongoose.models.UserRole) {
  mongoose.model('UserRole', UserRoleSchema);
}

export default mongoose.models.UserRole;
