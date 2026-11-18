import { describe, it, expect } from 'vitest';
import { EstimationService } from '../services/estimation.service';
import { BUSINESS_OBJECTIVES } from '../constants/questionnaire';

describe('EstimationService', () => {
  it('covers all 7 business objectives with deterministic service mapping', () => {
    BUSINESS_OBJECTIVES.forEach((obj) => {
      const result = EstimationService.calculate(obj);
      expect(result).toHaveProperty('recommendedService');
      expect(result).toHaveProperty('whyRecommended');
      expect(result).toHaveProperty('projectComplexity');
      expect(result).toHaveProperty('estimatedBudget');
      expect(result).toHaveProperty('estimatedDuration');
      expect(result.estimatedBudget).toContain('₹');
      expect(result.minBudget).toBeLessThanOrEqual(result.maxBudget);
      expect(result.minWeeks).toBeLessThanOrEqual(result.maxWeeks);
    });
  });

  it('maps Website to Web Development with dynamic page calculations', () => {
    const starter = EstimationService.calculate('Build a website', { pages: '1–5 pages' });
    const enterprise = EstimationService.calculate('Build a website', {
      pages: '15+ pages',
      authRequired: true,
      paymentIntegration: true,
      adminDashboard: true,
    });

    expect(starter.recommendedService).toBe('Web Development');
    expect(enterprise.recommendedService).toBe('Web Development');
    expect(enterprise.maxBudget).toBeGreaterThan(starter.maxBudget);
    expect(enterprise.maxWeeks).toBeGreaterThan(starter.maxWeeks);
  });

  it('maps Web Application to Full Stack Development and factors integrations', () => {
    const res = EstimationService.calculate('Develop a web application', {
      userRoles: 'Complex RBAC',
      dashboardRequirements: 'Custom reporting',
      thirdPartyIntegrations: ['Payment Gateway', 'CRM / ERP', 'Webhooks'],
    });

    expect(res.recommendedService).toBe('Full Stack Development');
    expect(res.projectComplexity).toMatch(/High|Enterprise/);
    expect(res.minWeeks).toBeGreaterThanOrEqual(4);
  });

  it('transparently generates conflict notes when user budget is significantly lower than scope', () => {
    const conflict = EstimationService.calculate(
      'Develop a mobile application',
      { platforms: 'Both platforms', mobileAuth: true, mobilePayment: true },
      'Below ₹25,000',
    );

    expect(conflict.budgetConflictNote).toBeDefined();
    expect(conflict.budgetConflictNote).toContain('Below ₹25,000');
  });
});

