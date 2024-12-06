import mongoose from 'mongoose';

const RoleResourceSchema = new mongoose.Schema({
  canCreate: {
    type: Boolean,
  },
  canRead: {
    type: Boolean,
  },
  canEdit: {
    type: Boolean,
  },
  canDelete: {
    type: Boolean,
  },
  resource: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource',
  },
  role: {
    type: String,
  },
  createAt: {
    type: Date,
  },
});

// RoleResourceSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'resources',
//     select: '-roleResource name',
//   });
//   next();
// });

if (!mongoose.models.RoleResource) {
  mongoose.model('RoleResource', RoleResourceSchema);
}

export default mongoose.models.RoleResource;
