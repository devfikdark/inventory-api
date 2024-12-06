import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  fullName: {
    type: String,
  },
  contact: {
    type: String,
  },
  presentAddress: {
    type: String,
  },
  permanentAddress: {
    type: String,
  },
  DoB: {
    type: String,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
  },
  tokens: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'AuthenticationToken',
    },
  ],
  createAt: {
    type: Date,
  },
});

// Query middleware
// UserSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'role',
//     select: '',
//   });
//   next();
// });

// UserSchema.pre('save', async function(next) {
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

UserSchema.methods.hashPassword = async function(password) {
  return await bcrypt.hash(password, 12);
};

UserSchema.methods.verifyPassword = async function(
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

if (!mongoose.models.User) {
  mongoose.model('User', UserSchema);
}

export default mongoose.models.User;
