/**
 * Shared TypeScript types for the Cynbit Smart Project Discovery & Cost Estimator.
 */
import type { LucideIcon } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* NEW SPECIFICATION TYPES                                                    */
/* -------------------------------------------------------------------------- */

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
  'Below ₹25,00,000',
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

export interface DynamicRequirements {
  // Website
  pages?: '1–5 pages' | '5–15 pages' | '15+ pages';
  authRequired?: 'Yes' | 'No' | boolean;
  paymentIntegration?: 'Yes' | 'No' | boolean;
  adminDashboard?: 'Yes' | 'No' | boolean;

  // Web application
  userRoles?: 'Single role' | 'Multi-role' | 'Complex RBAC';
  dashboardRequirements?: 'Basic analytics' | 'Advanced interactive dashboards' | 'Custom reporting';
  databaseRequirements?: 'Relational / SQL' | 'Document / NoSQL' | 'Scalability requirements';
  thirdPartyIntegrations?: string[];

  // Mobile application
  platforms?: 'Android' | 'iOS' | 'Both platforms';
  mobileAuth?: 'Yes' | 'No' | boolean;
  mobilePayment?: 'Yes' | 'No' | boolean;

  // AI automation
  aiChatbot?: boolean;
  workflowAutomation?: boolean;
  documentProcessing?: boolean;
  customAiIntegration?: boolean;

  // Cloud infrastructure
  cloudMigration?: boolean;
  deployment?: boolean;
  infrastructureOptimization?: boolean;
  scalabilityRequirements?: boolean;

  // Digital marketing
  seo?: boolean;
  socialMediaMarketing?: boolean;
  paidAdvertising?: boolean;
  contentMarketing?: boolean;

  // Generic selected list for arbitrary representation
  selectedItems?: string[];
}

export interface EstimationResult {
  recommendedService: string;
  whyRecommended: string;
  projectComplexity: 'Low' | 'Moderate' | 'High' | 'Enterprise';
  minBudget: number;
  maxBudget: number;
  estimatedBudget: string;
  minWeeks: number;
  maxWeeks: number;
  estimatedDuration: string;
  budgetConflictNote?: string;
  recommendedNextSteps: string[];
  summary: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field?: string; msg?: string; message?: string }>;
}

/* -------------------------------------------------------------------------- */
/* QUESTIONNAIRE & LEGACY TYPES (Maintained for full backward compatibility)  */
/* -------------------------------------------------------------------------- */

/** A single selectable answer in the questionnaire. */
export interface Option {
  value: string;
  label: string;
  hint?: string;
  icon?: LucideIcon;
}

export type QuestionId = 'goal' | 'solution' | 'budget' | 'timeline';

/** Definition of one questionnaire step. */
export interface Question {
  id: QuestionId;
  step: number;
  title: string;
  description: string;
  options: Option[];
  icon: LucideIcon;
}

/** Step 5 - contact details. */
export interface ContactDetails {
  fullName?: string;
  name?: string;
  email: string;
  company?: string;
  projectDescription?: string;
  description?: string;
}

/** Complete questionnaire state. */
export interface Answers {
  goal: string | null;
  solution: string | null;
  budget: string | null;
  timeline: string | null;
  contact: ContactDetails;
}

export type AnswerKey = Exclude<keyof Answers, 'contact'>;

/** Field-level validation messages. */
export type ValidationErrors = Partial<Record<keyof ContactDetails | AnswerKey | 'fullName' | 'projectDescription', string>>;

export type SubmissionStatus = 'idle' | 'submitting' | 'saved' | 'saved-without-api' | 'failed';

/** Supported service catalogue. */
export type ServiceId =
  | 'full-stack'
  | 'mobile-app'
  | 'ai-automation'
  | 'cloud-solutions'
  | 'digital-marketing'
  | 'custom-software';

export interface Service {
  id: ServiceId;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
}

export interface RecommendationResult {
  primary: Service;
  additional: Service[];
  reasons: string[];
  nextSteps: string[];
  matchScore: number;
}

/** Payload accepted by POST /api/projects. */
export interface ProjectInquiryPayload {
  customerName?: string;
  name?: string;
  email: string;
  company?: string;
  businessObjective?: BusinessObjective | string;
  goal?: string;
  projectType?: string;
  solution?: string;
  selectedRequirements?: DynamicRequirements;
  budget: string;
  timeline: string;
  projectDescription?: string;
  description?: string;
  recommendation: string;
  estimatedBudget?: string;
  estimatedDuration?: string;
}

export interface ProjectRecord extends ProjectInquiryPayload {
  id: string;
  createdAt: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface ApiSuccessBody<T> {
  success: true;
  message: string;
  data: T;
}
