/**
 * Questionnaire option labels for Cynbit Smart Project Discovery & Cost Estimator.
 */

export const BUSINESS_OBJECTIVES = [
  'Build a website',
  'Develop a web application',
  'Develop a mobile application',
  'Automate business operations',
  'Implement AI solutions',
  'Improve cloud infrastructure',
  'Improve digital marketing',
] as const;

export type BusinessObjective = (typeof BUSINESS_OBJECTIVES)[number];

export const BUDGET_OPTIONS = [
  'Below ₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹5,00,000',
  'Above ₹5,00,000',
  'Not decided',
] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

export const TIMELINE_OPTIONS = [
  '1–2 weeks',
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  'Flexible',
] as const;

export type TimelineOption = (typeof TIMELINE_OPTIONS)[number];

export const SERVICE_RECOMMENDATIONS: Record<BusinessObjective, string> = {
  'Build a website': 'Web Development',
  'Develop a web application': 'Full Stack Development',
  'Develop a mobile application': 'Mobile App Development',
  'Automate business operations': 'AI Automation',
  'Implement AI solutions': 'AI Development',
  'Improve cloud infrastructure': 'Cloud Solutions',
  'Improve digital marketing': 'Digital Marketing',
};
