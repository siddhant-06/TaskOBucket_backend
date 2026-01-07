import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    organization_key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model('Organization', OrganizationSchema);
export default Organization;
