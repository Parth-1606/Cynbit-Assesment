/**
 * Questionnaire option labels, mirrored from `frontend/src/data/questions.ts`.
 *
 * The API validates incoming inquiries against these lists so that only
 * values the UI can actually produce are persisted. If an option is added or
 * renamed in the frontend, update this file as well.
 */

export const GOAL_OPTIONS = [
  'Build a new digital product',
  'Automate business operations',
  'Improve an existing website',
  'Improve online presence',
  'Modernize existing infrastructure',
] as const;

export const SOLUTION_OPTIONS = [
  'Website / Web Application',
  'Mobile Application',
  'AI Automation',
  'Cloud Infrastructure',
  'Digital Marketing',
  'Custom Software Development',
  'Not sure yet',
] as const;

export const BUDGET_OPTIONS = [
  'Below ₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹5,00,000',
  'Above ₹5,00,000',
  'Not decided',
] as const;

export const TIMELINE_OPTIONS = [
  'Within 2 weeks',
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  'Flexible',
] as const;
