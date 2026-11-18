/**
 * Request validation for POST /api/projects using express-validator.
 */
import { body, type ValidationChain } from 'express-validator';
import {
  BUDGET_OPTIONS,
  BUSINESS_OBJECTIVES,
  TIMELINE_OPTIONS,
} from '../constants/questionnaire';

export const createProjectRules: ValidationChain[] = [
  body('customerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body().custom((_value, { req }) => {
    const hasName = (req.body.customerName && req.body.customerName.trim().length >= 2) ||
      (req.body.name && req.body.name.trim().length >= 2);
    if (!hasName) {
      throw new Error('Full name is required (at least 2 characters)');
    }
    return true;
  }),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email is too long'),

  body('company')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 150 }).withMessage('Company name must be 150 characters or fewer'),

  body().custom((_value, { req }) => {
    const objective = req.body.businessObjective || req.body.goal;
    if (!objective || !BUSINESS_OBJECTIVES.includes(objective)) {
      throw new Error('Valid business objective is required');
    }
    return true;
  }),

  body('budget')
    .trim()
    .notEmpty().withMessage('Budget is required')
    .isIn(BUDGET_OPTIONS as readonly string[]).withMessage('Unknown budget range'),

  body('timeline')
    .trim()
    .notEmpty().withMessage('Timeline is required')
    .isIn(TIMELINE_OPTIONS as readonly string[]).withMessage('Unknown timeline'),

  body().custom((_value, { req }) => {
    const desc = req.body.projectDescription || req.body.description;
    if (!desc || desc.trim().length < 20) {
      throw new Error('Project description must be at least 20 characters');
    }
    if (desc.trim().length > 3000) {
      throw new Error('Project description cannot exceed 3000 characters');
    }
    return true;
  }),
];
