import mongoose from 'mongoose';

const SprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['BACKLOG', 'SELECTED', 'IN_PROGRESS', 'DONE'],
      default: 'BACKLOG',
      index: true,
    },

    position: {
      type: Number,
      required: true, //  ordering inside column
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate position inside same column of a project
 */
SprintSchema.index({ projectId: 1, status: 1, position: 1 }, { unique: true });

const Sprint = mongoose.model('Sprint', SprintSchema);
export default Sprint;
