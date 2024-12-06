import mongoose from 'mongoose';

const AuthenticationTokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  createAt: {
    type: Date,
  },
  user: {
    type: String,
  },
});

if (!mongoose.models.AuthenticationToken) {
  mongoose.model('AuthenticationToken', AuthenticationTokenSchema);
}

export default mongoose.models.AuthenticationToken;
