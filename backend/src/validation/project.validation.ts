/**
 * Request validation for POST /api/projects using express-validator.
 * Chains are exported separately from the route so they can be reused in tests.
 */
import { body, type ValidationChain } from 'express-validator';
import {
  BUDGET_OPTIONS,
  GOAL_OPTIONS,
  SOLUTION_OPTIONS,
  TIMELINE_OPTIONS,
} from '../constants/questionnaire';

export const createProjectRules: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

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

  body('goal')
    .trim()
    .notEmpty().withMessage('Business goal is required')
    .isIn(GOAL_OPTIONS as readonly string[]).withMessage('Unknown business goal'),

  body('solution')
    .trim()
    .notEmpty().withMessage('Solution type is required')
    .isIn(SOLUTION_OPTIONS as readonly string[]).withMessage('Unknown solution type'),

  body('budget')
    .trim()
    .notEmpty().withMessage('Budget is required')
    .isIn(BUDGET_OPTIONS as readonly string[]).withMessage('Unknown budget range'),

  body('timeline')
    .trim()
    .notEmpty().withMessage('Timeline is required')
    .isIn(TIMELINE_OPTIONS as readonly string[]).withMessage('Unknown timeline'),

  body('description')
    .trim()
    .notEmpty().withMessage('Project description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),

  body('recommendation')
    .trim()
    .notEmpty().withMessage('Recommendation is required')
    .isLength({ max: 300 }).withMessage('Recommendation must be 300 characters or fewer'),
];
