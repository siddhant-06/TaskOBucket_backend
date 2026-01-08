import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    project_key: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Project Lead (Admin / PM)
    },

    // startDate: {
    //   type: Date,
    //   default: Date.now,
    // },

    isActive: {
      type: Boolean,
      default: true, // archive support
    },
  },
  { timestamps: true }
);

// Unique project key per organization
ProjectSchema.index({ organizationId: 1, project_key: 1 }, { unique: true });

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
