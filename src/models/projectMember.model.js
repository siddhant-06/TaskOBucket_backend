import mongoose from 'mongoose';

const ProjectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['PM', 'DEV', 'QA'],
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * A user can be added only once per project
 */
ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const ProjectMember = mongoose.model('ProjectMember', ProjectMemberSchema);
export default ProjectMember;
