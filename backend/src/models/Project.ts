/**
 * Mongoose model for a submitted project inquiry.
 */
import { Schema, model, type InferSchemaType } from 'mongoose';
import {
  BUDGET_OPTIONS,
  GOAL_OPTIONS,
  SOLUTION_OPTIONS,
  TIMELINE_OPTIONS,
} from '../constants/questionnaire';

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 150,
      default: '',
    },
    goal: {
      type: String,
      required: [true, 'Business goal is required'],
      trim: true,
      enum: { values: [...GOAL_OPTIONS], message: '{VALUE} is not a valid business goal' },
    },
    solution: {
      type: String,
      required: [true, 'Solution type is required'],
      trim: true,
      enum: { values: [...SOLUTION_OPTIONS], message: '{VALUE} is not a valid solution type' },
    },
    budget: {
      type: String,
      required: [true, 'Budget is required'],
      trim: true,
      enum: { values: [...BUDGET_OPTIONS], message: '{VALUE} is not a valid budget range' },
    },
    timeline: {
      type: String,
      required: [true, 'Timeline is required'],
      trim: true,
      enum: { values: [...TIMELINE_OPTIONS], message: '{VALUE} is not a valid timeline' },
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      trim: true,
      maxlength: 300,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

// Fast chronological listing for the admin dashboard.
projectSchema.index({ createdAt: -1 });

export type ProjectDocument = InferSchemaType<typeof projectSchema>;

export const Project = model('Project', projectSchema);
