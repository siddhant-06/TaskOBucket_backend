import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    project_key: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// One project key must be unique per organization
ProjectSchema.index({ organizationId: 1, project_key: 1 }, { unique: true });

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
