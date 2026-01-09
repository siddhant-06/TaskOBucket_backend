// models/issue.model.js
import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    /** Project always required */
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },

    /** Sprint optional (can be backlog issue) */
    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sprint',
      default: null,
      index: true,
    },

    /** Kanban status */
    status: {
      type: String,
      enum: ['BACKLOG', 'SELECTED', 'IN_PROGRESS', 'DONE'],
      default: 'BACKLOG',
      index: true,
    },

    /** Ordering inside a column */
    position: {
      type: Number,
      required: true,
    },

    /** Multiple assignees */
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    /** Issue reporter */
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /** Issue type */
    type: {
      type: String,
      enum: ['STORY', 'TASK', 'BUG'],
      default: 'TASK',
      index: true,
    },

    /** Priority */
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
      index: true,
    },

    /** Tags */
    tags: {
      type: [String],
      enum: ['FRONTEND', 'BACKEND', 'QA'],
      default: [],
    },

    /** Timeline */
    startDate: {
      type: Date,
    },

    dueDate: {
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
 * Prevent duplicate position inside same column of sprint/project
 */
IssueSchema.index(
  { projectId: 1, sprintId: 1, status: 1, position: 1 },
  { unique: true }
);

const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;
