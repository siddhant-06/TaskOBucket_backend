import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatarUrl: { type: String },
    jobTitle: { type: String },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    isOrgAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    work_email: { type: String },
    company_name: { type: String, trim: true },
    isInvited: { type: Boolean, default: false },
    inviteToken: { type: String },
    inviteTokenExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;
