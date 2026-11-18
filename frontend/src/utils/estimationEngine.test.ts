import { describe, it, expect } from 'vitest';
import { calculateProjectEstimate, formatINR } from './estimationEngine';
import { BUSINESS_OBJECTIVES } from '../types';

describe('Frontend Estimation Engine', () => {
  it('formats INR correctly according to Indian numbering', () => {
    expect(formatINR(50000)).toMatch(/₹\s?50,000/);
    expect(formatINR(150000)).toMatch(/₹\s?1,50,000/);
  });

  it('determines the correct Cynbit service for all 7 objectives', () => {
    const mappings: Record<string, string> = {
      'Build a website': 'Web Development',
      'Develop a web application': 'Full Stack Development',
      'Develop a mobile application': 'Mobile App Development',
      'Automate business operations': 'AI Automation',
      'Implement AI solutions': 'AI Development',
      'Improve cloud infrastructure': 'Cloud Solutions',
      'Improve digital marketing': 'Digital Marketing',
    };

    BUSINESS_OBJECTIVES.forEach((obj) => {
      const res = calculateProjectEstimate(obj);
      expect(res.recommendedService).toBe(mappings[obj]);
      expect(res.minBudget).toBeGreaterThan(0);
      expect(res.maxBudget).toBeGreaterThanOrEqual(res.minBudget);
      expect(res.minWeeks).toBeGreaterThan(0);
      expect(res.maxWeeks).toBeGreaterThanOrEqual(res.minWeeks);
    });
  });

  it('adjusts scope and budget for web application features', () => {
    const basic = calculateProjectEstimate('Develop a web application', {});
    const advanced = calculateProjectEstimate('Develop a web application', {
      userRoles: 'Complex RBAC',
      dashboardRequirements: 'Custom reporting',
      databaseRequirements: 'Scalability requirements',
      thirdPartyIntegrations: ['Payment Gateway', 'CRM / ERP'],
    });

    expect(advanced.minBudget).toBeGreaterThan(basic.minBudget);
    expect(advanced.maxBudget).toBeGreaterThan(basic.maxBudget);
    expect(advanced.projectComplexity).toMatch(/High|Enterprise/);
  });

  it('flags budget conflicts when stated budget is insufficient for scope', () => {
    const res = calculateProjectEstimate(
      'Develop a mobile application',
      { platforms: 'Both platforms', mobileAuth: 'Yes', mobilePayment: 'Yes' },
      'Below ₹25,000',
    );

    expect(res.budgetConflictNote).toBeDefined();
    expect(res.budgetConflictNote).toContain('Below ₹25,000');
  });
});

