/**
 * Estimation Engine for Cynbit Smart Project Discovery & Cost Estimator (Frontend).
 * Deterministic business logic calculating budget, duration, complexity and service recommendations.
 */

import {
  type BusinessObjective,
  type BudgetOption,
  type TimelineOption,
  type DynamicRequirements,
  type EstimationResult,
} from '../types';

export const SERVICE_RECOMMENDATIONS: Record<BusinessObjective, string> = {
  'Build a website': 'Web Development',
  'Develop a web application': 'Full Stack Development',
  'Develop a mobile application': 'Mobile App Development',
  'Automate business operations': 'AI Automation',
  'Implement AI solutions': 'AI Development',
  'Improve cloud infrastructure': 'Cloud Solutions',
  'Improve digital marketing': 'Digital Marketing',
};

/** Formats INR currency values according to Indian numbering standards (e.g. ₹1,50,000) */
export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

function isYes(val: boolean | string | undefined): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const lower = val.trim().toLowerCase();
    return lower === 'yes' || lower === 'true';
  }
  return false;
}

export function calculateProjectEstimate(
  objective: BusinessObjective,
  requirements: DynamicRequirements = {},
  userBudget?: BudgetOption,
  _userTimeline?: TimelineOption,
): EstimationResult {
  const recommendedService = SERVICE_RECOMMENDATIONS[objective] || 'Custom Software Development';

  let minCost = 25000;
  let maxCost = 45000;
  let minWeeks = 2;
  let maxWeeks = 4;
  let featurePoints = 1;

  switch (objective) {
    case 'Build a website': {
      minCost = 25000;
      maxCost = 45000;
      minWeeks = 2;
      maxWeeks = 3;

      if (requirements.pages === '5–15 pages') {
        minCost += 15000;
        maxCost += 25000;
        minWeeks += 1;
        maxWeeks += 1;
        featurePoints += 1;
      } else if (requirements.pages === '15+ pages') {
        minCost += 35000;
        maxCost += 55000;
        minWeeks += 2;
        maxWeeks += 3;
        featurePoints += 2;
      }

      if (isYes(requirements.authRequired)) {
        minCost += 10000;
        maxCost += 18000;
        minWeeks += 1;
        maxWeeks += 1;
        featurePoints += 1;
      }

      if (isYes(requirements.paymentIntegration)) {
        minCost += 15000;
        maxCost += 25000;
        minWeeks += 1;
        maxWeeks += 1;
        featurePoints += 1;
      }

      if (isYes(requirements.adminDashboard)) {
        minCost += 20000;
        maxCost += 30000;
        minWeeks += 1;
        maxWeeks += 2;
        featurePoints += 2;
      }
      break;
    }

    case 'Develop a web application': {
      minCost = 65000;
      maxCost = 110000;
      minWeeks = 4;
      maxWeeks = 6;
      featurePoints = 3;

      if (requirements.userRoles === 'Multi-role') {
        minCost += 15000;
        maxCost += 25000;
        minWeeks += 1;
        maxWeeks += 1;
        featurePoints += 1;
      } else if (requirements.userRoles === 'Complex RBAC') {
        minCost += 30000;
        maxCost += 50000;
        minWeeks += 2;
        maxWeeks += 2;
        featurePoints += 2;
      }

      if (requirements.dashboardRequirements === 'Advanced interactive dashboards') {
        minCost += 20000;
        maxCost += 35000;
        minWeeks += 1;
        maxWeeks += 2;
        featurePoints += 1;
      } else if (requirements.dashboardRequirements === 'Custom reporting') {
        minCost += 35000;
        maxCost += 55000;
        minWeeks += 2;
        maxWeeks += 3;
        featurePoints += 2;
      }

      if (requirements.databaseRequirements === 'Document / NoSQL') {
        minCost += 10000;
        maxCost += 20000;
      } else if (requirements.databaseRequirements === 'Scalability requirements') {
        minCost += 30000;
        maxCost += 50000;
        minWeeks += 1;
        maxWeeks += 2;
        featurePoints += 2;
      }

      const integrationsCount = Array.isArray(requirements.thirdPartyIntegrations)
        ? requirements.thirdPartyIntegrations.length
        : 0;
      if (integrationsCount > 0) {
        minCost += integrationsCount * 12000;
        maxCost += integrationsCount * 22000;
        minWeeks += Math.min(integrationsCount, 2);
        maxWeeks += Math.min(integrationsCount * 2, 3);
        featurePoints += integrationsCount;
      }
      break;
    }

    case 'Develop a mobile application': {
      minCost = 80000;
      maxCost = 135000;
      minWeeks = 5;
      maxWeeks = 8;
      featurePoints = 3;

      if (requirements.platforms === 'Both platforms') {
        minCost += 45000;
        maxCost += 75000;
        minWeeks += 2;
        maxWeeks += 3;
        featurePoints += 2;
      }

      if (isYes(requirements.mobileAuth)) {
        minCost += 15000;
        maxCost += 25000;
        minWeeks += 1;
        maxWeeks += 1;
        featurePoints += 1;
      }

      if (isYes(requirements.mobilePayment)) {
        minCost += 20000;
        maxCost += 35000;
        minWeeks += 1;
        maxWeeks += 2;
        featurePoints += 1;
      }
      break;
    }

    case 'Automate business operations': {
      minCost = 45000;
      maxCost = 75000;
      minWeeks = 3;
      maxWeeks = 5;
      featurePoints = 2;

      let selectedAutomations = 0;
      if (requirements.aiChatbot) selectedAutomations++;
      if (requirements.workflowAutomation) selectedAutomations++;
      if (requirements.documentProcessing) selectedAutomations++;
      if (requirements.customAiIntegration) selectedAutomations++;

      if (selectedAutomations > 0) {
        minCost += selectedAutomations * 22000;
        maxCost += selectedAutomations * 38000;
        minWeeks += Math.min(selectedAutomations, 3);
        maxWeeks += selectedAutomations * 2;
        featurePoints += selectedAutomations;
      }
      break;
    }

    case 'Implement AI solutions': {
      minCost = 75000;
      maxCost = 130000;
      minWeeks = 4;
      maxWeeks = 7;
      featurePoints = 3;

      let selectedAi = 0;
      if (requirements.aiChatbot) selectedAi++;
      if (requirements.workflowAutomation) selectedAi++;
      if (requirements.documentProcessing) selectedAi++;
      if (requirements.customAiIntegration) selectedAi++;

      if (selectedAi > 0) {
        minCost += selectedAi * 28000;
        maxCost += selectedAi * 48000;
        minWeeks += Math.min(selectedAi, 3);
        maxWeeks += selectedAi * 2;
        featurePoints += selectedAi * 2;
      }
      break;
    }

    case 'Improve cloud infrastructure': {
      minCost = 40000;
      maxCost = 75000;
      minWeeks = 2;
      maxWeeks = 4;
      featurePoints = 2;

      let selectedCloud = 0;
      if (requirements.cloudMigration) selectedCloud++;
      if (requirements.deployment) selectedCloud++;
      if (requirements.infrastructureOptimization) selectedCloud++;
      if (requirements.scalabilityRequirements) selectedCloud++;

      if (selectedCloud > 0) {
        minCost += selectedCloud * 20000;
        maxCost += selectedCloud * 35000;
        minWeeks += Math.min(selectedCloud, 2);
        maxWeeks += selectedCloud + 1;
        featurePoints += selectedCloud;
      }
      break;
    }

    case 'Improve digital marketing': {
      minCost = 25000;
      maxCost = 50000;
      minWeeks = 2;
      maxWeeks = 4;
      featurePoints = 1;

      let selectedMkt = 0;
      if (requirements.seo) selectedMkt++;
      if (requirements.socialMediaMarketing) selectedMkt++;
      if (requirements.paidAdvertising) selectedMkt++;
      if (requirements.contentMarketing) selectedMkt++;

      if (selectedMkt > 0) {
        minCost += selectedMkt * 15000;
        maxCost += selectedMkt * 28000;
        minWeeks += 1;
        maxWeeks += Math.min(selectedMkt + 1, 4);
        featurePoints += selectedMkt;
      }
      break;
    }
  }

  if (Array.isArray(requirements.selectedItems) && requirements.selectedItems.length > 0) {
    const additional = Math.min(requirements.selectedItems.length, 6);
    minCost += additional * 8000;
    maxCost += additional * 15000;
    featurePoints += Math.floor(additional / 2);
  }

  let projectComplexity: 'Low' | 'Moderate' | 'High' | 'Enterprise' = 'Low';
  if (maxCost > 300000 || featurePoints >= 8) {
    projectComplexity = 'Enterprise';
  } else if (maxCost > 150000 || featurePoints >= 5) {
    projectComplexity = 'High';
  } else if (maxCost > 60000 || featurePoints >= 3) {
    projectComplexity = 'Moderate';
  }

  const whyReasons: Record<BusinessObjective, string> = {
    'Build a website':
      'A bespoke Web Development engagement ensures high conversion, clean typography, responsive layout across all viewports, and an intuitive management workflow tailored to your brand identity.',
    'Develop a web application':
      'Full Stack Development provides a high-performance backend, resilient database schema, role-based security, and dynamic frontend interactions engineered for continuous scale.',
    'Develop a mobile application':
      'Mobile App Development delivers a fluid, touch-optimized user experience with robust native integrations, offline resilience, and secure authentication.',
    'Automate business operations':
      'AI Automation eliminates manual bottlenecks, integrates disparate business workflows, and orchestrates intelligent task pipelines to amplify operational productivity.',
    'Implement AI solutions':
      'AI Development incorporates modern foundational models, specialized document analysis, conversational agents, and data privacy safeguards tailored to your domain.',
    'Improve cloud infrastructure':
      'Cloud Solutions guarantees high uptime, automated deployment pipelines, horizontal elasticity, and cost-optimized infrastructure management.',
    'Improve digital marketing':
      'Digital Marketing pairs search engine visibility with targeted acquisition channels and content funnels to generate measurable qualified leads.',
  };

  const whyRecommended =
    whyReasons[objective] || 'Custom engineered technology solution tailored to your exact operational requirements.';

  const estimatedBudget = `${formatINR(minCost)} – ${formatINR(maxCost)}`;
  const estimatedDuration = `${minWeeks}–${maxWeeks} weeks`;

  let budgetConflictNote: string | undefined;
  if (userBudget) {
    if (userBudget === 'Below ₹25,000' && minCost > 35000) {
      budgetConflictNote = `Your selected budget is "${userBudget}", while the indicative estimate for this scope is ${estimatedBudget}. Cynbit can phase your deliverables (starting with a core MVP) or refine feature scope to align with your target budget.`;
    } else if (userBudget === '₹25,000–₹50,000' && minCost > 60000) {
      budgetConflictNote = `Your selected budget is "${userBudget}", whereas the estimated scope calls for ${estimatedBudget}. We recommend scheduling an initial discovery call to prioritize high-impact features.`;
    } else if (userBudget === '₹50,000–₹1,00,000' && minCost > 120000) {
      budgetConflictNote = `Your stated budget is "${userBudget}", while the indicative requirement estimate is ${estimatedBudget}. A phased milestone roadmap can help align scope with budget limits.`;
    } else if (userBudget === '₹1,00,000–₹5,00,000' && minCost > 550000) {
      budgetConflictNote = `Your target budget is "${userBudget}", while this comprehensive enterprise configuration is estimated at ${estimatedBudget}.`;
    }
  }

  const recommendedNextSteps = [
    'Technical Discovery Call: 30-minute scoping session with a Cynbit Lead Architect.',
    'Architecture & Specification: Detailed breakdown of deliverables, sprint milestones, and tech stack.',
    'Formal Proposal & Kickoff: Final scope confirmation, timeline sign-off, and dedicated sprint team onboarding.',
  ];

  const summary = `${recommendedService} project with ${projectComplexity.toLowerCase()} complexity. Indicative investment estimate of ${estimatedBudget} across an estimated timeline of ${estimatedDuration}.`;

  return {
    recommendedService,
    whyRecommended,
    projectComplexity,
    minBudget: minCost,
    maxBudget: maxCost,
    estimatedBudget,
    minWeeks,
    maxWeeks,
    estimatedDuration,
    budgetConflictNote,
    recommendedNextSteps,
    summary,
  };
}

