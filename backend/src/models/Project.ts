/**
 * Mongoose model for a submitted Cynbit project inquiry.
 * Supports both specified field names and backward-compatible aliases.
 */
import { Schema, model, type InferSchemaType } from 'mongoose';
import {
  BUDGET_OPTIONS,
  BUSINESS_OBJECTIVES,
  TIMELINE_OPTIONS,
} from '../constants/questionnaire';

const projectSchema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    name: {
      type: String,
      trim: true,
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
    businessObjective: {
      type: String,
      required: [true, 'Business objective is required'],
      trim: true,
      enum: {
        values: [...BUSINESS_OBJECTIVES],
        message: '{VALUE} is not a valid business objective',
      },
    },
    goal: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      trim: true,
    },
    solution: {
      type: String,
      trim: true,
    },
    selectedRequirements: {
      type: Schema.Types.Mixed,
      default: {},
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
    projectDescription: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      minlength: 20,
      maxlength: 3000,
    },
    description: {
      type: String,
      trim: true,
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      trim: true,
      maxlength: 300,
    },
    estimatedBudget: {
      type: String,
      required: [true, 'Estimated budget is required'],
      trim: true,
    },
    estimatedDuration: {
      type: String,
      required: [true, 'Estimated duration is required'],
      trim: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
      immutable: true,
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

// Pre-save synchronization hook to keep primary and alias fields in sync
projectSchema.pre('validate', function syncAliases(next) {
  if (!this.customerName && this.name) {
    this.customerName = this.name;
  } else if (!this.name && this.customerName) {
    this.name = this.customerName;
  }

  if (!this.businessObjective && this.goal) {
    this.businessObjective = this.goal as (typeof BUSINESS_OBJECTIVES)[number];
  } else if (!this.goal && this.businessObjective) {
    this.goal = this.businessObjective;
  }

  if (!this.projectType && this.solution) {
    this.projectType = this.solution;
  } else if (!this.solution && this.projectType) {
    this.solution = this.projectType;
  }

  if (!this.projectDescription && this.description) {
    this.projectDescription = this.description;
  } else if (!this.description && this.projectDescription) {
    this.description = this.projectDescription;
  }

  if (!this.createdDate && this.createdAt) {
    this.createdDate = this.createdAt;
  } else if (!this.createdAt && this.createdDate) {
    this.createdAt = this.createdDate;
  }

  next();
});

// Fast chronological listing
projectSchema.index({ createdAt: -1 });
projectSchema.index({ createdDate: -1 });

export type ProjectDocument = InferSchemaType<typeof projectSchema>;

export const Project = model('Project', projectSchema);
