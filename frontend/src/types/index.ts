/**
 * Shared TypeScript types for the Project Discovery Assistant.
 */
import type { LucideIcon } from 'lucide-react';

/** A single selectable answer in the questionnaire. */
export interface Option {
  /** Stable machine value stored in state and sent to the API. */
  value: string;
  label: string;
  /** Optional one-line hint shown under the label. */
  hint?: string;
  icon?: LucideIcon;
}

export type QuestionId = 'goal' | 'solution' | 'budget' | 'timeline';

/** Definition of one questionnaire step (steps 1-4). */
export interface Question {
  id: QuestionId;
  /** 1-based step number used by the progress indicator. */
  step: number;
  title: string;
  description: string;
  options: Option[];
  icon: LucideIcon;
}

/** Step 5 - contact details. */
export interface ContactDetails {
  name: string;
  email: string;
  company: string;
  description: string;
}

/** Complete questionnaire state, preserved while navigating between steps. */
export interface Answers {
  goal: string | null;
  solution: string | null;
  budget: string | null;
  timeline: string | null;
  contact: ContactDetails;
}

export type AnswerKey = Exclude<keyof Answers, 'contact'>;

/** Field-level validation messages. */
export type ValidationErrors = Partial<Record<keyof ContactDetails | AnswerKey, string>>;

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
  /** Best-matching service. */
  primary: Service;
  /** Runner-up services worth discussing. */
  additional: Service[];
  /** Human-readable reasons, one per contributing rule. */
  reasons: string[];
  /** Ordered action plan for the customer. */
  nextSteps: string[];
  /** 0-100, used only for transparent display of match strength. */
  matchScore: number;
}

/** Payload accepted by POST /api/projects. */
export interface ProjectInquiryPayload {
  name: string;
  email: string;
  company?: string;
  goal: string;
  solution: string;
  budget: string;
  timeline: string;
  description: string;
  recommendation: string;
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
