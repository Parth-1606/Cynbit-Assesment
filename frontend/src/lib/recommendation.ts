/**
 * Rule-based recommendation engine.
 *
 * This is intentionally NOT marketed as AI. It is a transparent, deterministic
 * scoring model: every rule that contributes to the result also produces the
 * human-readable "why" copy shown in the UI, so the recommendation can always
 * be explained and audited.
 *
 * Scoring model
 * -------------
 *   score(service) = goalWeight + solutionWeight + budgetFit + timelineFit
 *
 * - goalWeight     (0-6)  how well the service answers the stated business goal
 * - solutionWeight (0-10) explicit "I need X" selection - the strongest signal
 * - budgetFit      (0-3)  whether the budget band realistically funds the service
 * - timelineFit    (0-3)  whether the deadline is achievable for the service
 *
 * The highest scorer becomes the primary recommendation. Services within
 * `ADDITIONAL_THRESHOLD` of the primary score are surfaced as additional
 * services (capped at `MAX_ADDITIONAL`).
 */
import type { RecommendationResult, Service, ServiceId } from '../types';
import { SERVICES } from '../data/services';

/** How close a runner-up must be to appear as an additional service. */
const ADDITIONAL_THRESHOLD = 0.5;
const MAX_ADDITIONAL = 3;

/** Business goal -> service affinity (0-6). */
const GOAL_WEIGHTS: Record<string, Partial<Record<ServiceId, number>>> = {
  'Build a new digital product': {
    'full-stack': 6,
    'custom-software': 5,
    'mobile-app': 4,
    'cloud-solutions': 2,
  },
  'Automate business operations': {
    'ai-automation': 6,
    'custom-software': 4,
    'cloud-solutions': 3,
    'full-stack': 2,
  },
  'Improve an existing website': {
    'full-stack': 6,
    'digital-marketing': 3,
    'custom-software': 2,
  },
  'Improve online presence': {
    'digital-marketing': 6,
    'full-stack': 3,
    'mobile-app': 1,
  },
  'Modernize existing infrastructure': {
    'cloud-solutions': 6,
    'custom-software': 4,
    'ai-automation': 2,
  },
};

/** Selected solution type -> service affinity (0-10). "Not sure yet" contributes nothing. */
const SOLUTION_WEIGHTS: Record<string, Partial<Record<ServiceId, number>>> = {
  'Website / Web Application': { 'full-stack': 10, 'custom-software': 4 },
  'Mobile Application': { 'mobile-app': 10, 'full-stack': 3 },
  'AI Automation': { 'ai-automation': 10, 'custom-software': 3, 'cloud-solutions': 2 },
  'Cloud Infrastructure': { 'cloud-solutions': 10, 'custom-software': 3 },
  'Digital Marketing': { 'digital-marketing': 10, 'full-stack': 2 },
  'Custom Software Development': { 'custom-software': 10, 'full-stack': 5 },
  'Not sure yet': {},
};

/**
 * Budget bands (in UI order) -> whether each service is realistic to fund.
 * Returns a fit score of 0-3; 0 means the band is a poor fit for that service.
 */
const BUDGET_FIT: Record<string, Partial<Record<ServiceId, number>>> = {
  'Below ₹25,000': {
    'digital-marketing': 3,
    'full-stack': 2,
    'ai-automation': 1,
    'mobile-app': 0,
    'custom-software': 1,
    'cloud-solutions': 1,
  },
  '₹25,000–₹50,000': {
    'full-stack': 3,
    'digital-marketing': 3,
    'ai-automation': 2,
    'custom-software': 2,
    'cloud-solutions': 2,
    'mobile-app': 1,
  },
  '₹50,000–₹1,00,000': {
    'full-stack': 3,
    'mobile-app': 3,
    'ai-automation': 3,
    'cloud-solutions': 3,
    'digital-marketing': 2,
    'custom-software': 3,
  },
  '₹1,00,000–₹5,00,000': {
    'full-stack': 3,
    'mobile-app': 3,
    'ai-automation': 3,
    'cloud-solutions': 3,
    'custom-software': 3,
    'digital-marketing': 2,
  },
  'Above ₹5,00,000': {
    'full-stack': 3,
    'mobile-app': 3,
    'ai-automation': 3,
    'cloud-solutions': 3,
    'custom-software': 3,
    'digital-marketing': 2,
  },
  // Unknown budget: neutral, so it neither helps nor hurts any service.
  'Not decided': {},
};

/**
 * Timeline bands (in UI order) -> delivery feasibility per service (0-3).
 * Tight deadlines penalise services that need a longer build cycle.
 */
const TIMELINE_FIT: Record<string, Partial<Record<ServiceId, number>>> = {
  'Within 2 weeks': {
    'digital-marketing': 3,
    'full-stack': 2,
    'ai-automation': 1,
    'custom-software': 1,
    'cloud-solutions': 1,
    'mobile-app': 0,
  },
  'Within 1 month': {
    'full-stack': 3,
    'digital-marketing': 3,
    'ai-automation': 2,
    'cloud-solutions': 2,
    'custom-software': 2,
    'mobile-app': 1,
  },
  '1–3 months': {
    'full-stack': 3,
    'mobile-app': 3,
    'ai-automation': 3,
    'cloud-solutions': 3,
    'custom-software': 3,
    'digital-marketing': 2,
  },
  '3–6 months': {
    'full-stack': 3,
    'mobile-app': 3,
    'ai-automation': 3,
    'cloud-solutions': 3,
    'custom-software': 3,
    'digital-marketing': 2,
  },
  // Flexible deadlines suit anything, with a slight edge to bigger builds.
  Flexible: {
    'full-stack': 3,
    'mobile-app': 3,
    'ai-automation': 3,
    'cloud-solutions': 3,
    'custom-software': 3,
    'digital-marketing': 3,
  },
};

/** Maximum possible score, used to normalise the displayed match percentage. */
const MAX_SCORE = 6 + 10 + 3 + 3;

export interface RecommendationInput {
  goal: string;
  solution: string;
  budget: string;
  timeline: string;
}

/**
 * Scores every service for the given answers and returns a fully explained
 * recommendation. Pure and deterministic - safe to unit test.
 */
export function buildRecommendation(input: RecommendationInput): RecommendationResult {
  const { goal, solution, budget, timeline } = input;

  const goalRule = GOAL_WEIGHTS[goal] ?? {};
  const solutionRule = SOLUTION_WEIGHTS[solution] ?? {};
  const budgetRule = BUDGET_FIT[budget] ?? {};
  const timelineRule = TIMELINE_FIT[timeline] ?? {};

  const scored = SERVICES.map((service) => {
    const goalWeight = goalRule[service.id] ?? 0;
    const solutionWeight = solutionRule[service.id] ?? 0;
    const budgetFit = budgetRule[service.id] ?? 0;
    const timelineFit = timelineRule[service.id] ?? 0;

    return {
      service,
      score: goalWeight + solutionWeight + budgetFit + timelineFit,
      goalWeight,
      solutionWeight,
      budgetFit,
      timelineFit,
    };
  });

  // Deterministic ordering: score desc, then catalogue order for stability.
  const ranked = scored
    .map((entry, index) => ({ ...entry, index }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const [top, ...rest] = ranked;
  const primary = top.service;

  const additional = rest
    .filter((entry) => top.score > 0 && entry.score / top.score >= ADDITIONAL_THRESHOLD)
    .slice(0, MAX_ADDITIONAL)
    .map((entry) => entry.service);

  const matchScore =
    top.score === 0 ? 0 : Math.max(5, Math.round((top.score / MAX_SCORE) * 100));

  return {
    primary,
    additional,
    reasons: explainReasons(input, top),
    nextSteps: buildNextSteps(input, primary),
    matchScore,
  };
}

/** Builds the "why this service" bullets from the winning service's scores. */
function explainReasons(
  input: RecommendationInput,
  winner: {
    service: Service;
    goalWeight: number;
    solutionWeight: number;
    budgetFit: number;
    timelineFit: number;
  },
): string[] {
  const reasons: string[] = [];
  const { service } = winner;

  if (winner.solutionWeight >= 8) {
    reasons.push(
      `You asked specifically for ${input.solution.toLowerCase()}, which maps directly to ${service.name}.`,
    );
  } else if (input.solution === 'Not sure yet') {
    reasons.push(
      `You selected "Not sure yet", so the match leans on your business goal rather than a pre-selected solution.`,
    );
  } else if (winner.solutionWeight > 0) {
    reasons.push(
      `Your chosen solution type (${input.solution}) supports ${service.name} as a strong secondary signal.`,
    );
  }

  if (winner.goalWeight >= 4) {
    reasons.push(
      `Your primary goal - "${input.goal}" - is one of the clearest use cases for ${service.name}.`,
    );
  } else if (winner.goalWeight > 0) {
    reasons.push(`Your goal of "${input.goal}" aligns well with ${service.name}.`);
  }

  if (winner.budgetFit >= 3 && input.budget !== 'Not decided') {
    reasons.push(`Your budget of ${input.budget} comfortably covers a ${service.name} engagement.`);
  } else if (input.budget === 'Not decided') {
    reasons.push(`Budget is still open, so scope will be sized together during discovery.`);
  } else if (winner.budgetFit === 0) {
    reasons.push(
      `A ${input.budget} budget is tight for ${service.name} - we would phase the work or suggest a leaner alternative.`,
    );
  }

  if (winner.timelineFit === 0) {
    reasons.push(
      `The "${input.timeline}" deadline is aggressive for ${service.name}; we would propose an MVP-first plan.`,
    );
  } else if (input.timeline === 'Flexible') {
    reasons.push(`A flexible timeline lets us prioritise quality and iterate on ${service.name}.`);
  }

  // Guarantee at least one explanation even if every rule scored zero.
  if (reasons.length === 0) {
    reasons.push(
      `${service.name} scored highest across your combined goal, solution, budget and timeline answers.`,
    );
  }

  return reasons;
}

/** Produces a concrete, ordered action plan for the customer. */
function buildNextSteps(input: RecommendationInput, primary: Service): string[] {
  const steps = [
    `Share this project brief with the Cynbit team to book a 30-minute discovery call about ${primary.name}.`,
    `We validate scope, assumptions and success metrics against your goal: "${input.goal}".`,
  ];

  if (input.budget === 'Not decided') {
    steps.push('Get a detailed, phased quotation so the budget can be finalised before kickoff.');
  } else {
    steps.push(`Confirm the ${input.budget} budget band and payment milestones for the ${input.timeline} plan.`);
  }

  if (input.timeline === 'Within 2 weeks' || input.timeline === 'Within 1 month') {
    steps.push(
      `Agree a compressed delivery plan with weekly demos to hit the ${input.timeline} deadline.`,
    );
  } else {
    steps.push(`Agree a delivery roadmap with milestones mapped to the ${input.timeline} timeline.`);
  }

  steps.push('Kick off with a signed statement of work and an assigned project lead.');

  return steps;
}
