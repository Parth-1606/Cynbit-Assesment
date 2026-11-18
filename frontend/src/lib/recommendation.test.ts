/**
 * Unit tests for the rule-based recommendation engine.
 * These assert the documented example mappings and general invariants.
 */
import { describe, it, expect } from 'vitest';
import { buildRecommendation } from './recommendation';
import { SERVICES } from '../data/services';
import type { ServiceId } from '../types';

const BASE = {
  goal: 'Build a new digital product',
  solution: 'Website / Web Application',
  budget: '₹50,000–₹1,00,000',
  timeline: '1–3 months',
};

const ids = (result: ReturnType<typeof buildRecommendation>) => ({
  primary: result.primary.id as ServiceId,
  additional: result.additional.map((service) => service.id as ServiceId),
});

describe('buildRecommendation - documented example mappings', () => {
  it('maps website requirements to Full Stack Development', () => {
    const result = buildRecommendation({
      ...BASE,
      goal: 'Improve an existing website',
      solution: 'Website / Web Application',
    });
    expect(result.primary.id).toBe('full-stack');
  });

  it('maps business automation to AI Automation', () => {
    const result = buildRecommendation({
      ...BASE,
      goal: 'Automate business operations',
      solution: 'AI Automation',
    });
    expect(result.primary.id).toBe('ai-automation');
  });

  it('maps infrastructure modernization to Cloud Solutions', () => {
    const result = buildRecommendation({
      ...BASE,
      goal: 'Modernize existing infrastructure',
      solution: 'Cloud Infrastructure',
    });
    expect(result.primary.id).toBe('cloud-solutions');
  });

  it('maps online visibility to Digital Marketing', () => {
    const result = buildRecommendation({
      ...BASE,
      goal: 'Improve online presence',
      solution: 'Digital Marketing',
    });
    expect(result.primary.id).toBe('digital-marketing');
  });

  it('maps mobile application needs to Mobile App Development', () => {
    const result = buildRecommendation({
      ...BASE,
      solution: 'Mobile Application',
    });
    expect(result.primary.id).toBe('mobile-app');
  });

  it('maps custom software needs to Custom Software Development', () => {
    const result = buildRecommendation({
      ...BASE,
      solution: 'Custom Software Development',
    });
    expect(result.primary.id).toBe('custom-software');
  });
});

describe('buildRecommendation - invariants', () => {
  it('never returns more additional services than the cap', () => {
    const result = buildRecommendation(BASE);
    expect(result.additional.length).toBeLessThanOrEqual(3);
  });

  it('never repeats the primary service in the additional list', () => {
    const { primary, additional } = ids(buildRecommendation(BASE));
    expect(additional).not.toContain(primary);
  });

  it('always returns at least one reason and one next step', () => {
    const result = buildRecommendation(BASE);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.nextSteps.length).toBeGreaterThan(0);
  });

  it('is deterministic - identical inputs give identical output', () => {
    const a = buildRecommendation(BASE);
    const b = buildRecommendation(BASE);
    expect(a).toEqual(b);
  });

  it('produces a match score between 1 and 100 for a valid input', () => {
    const result = buildRecommendation(BASE);
    expect(result.matchScore).toBeGreaterThan(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
  });

  it('handles "Not sure yet" without crashing and still recommends something', () => {
    const result = buildRecommendation({
      ...BASE,
      solution: 'Not sure yet',
      budget: 'Not decided',
      timeline: 'Flexible',
    });
    expect(SERVICES.map((service) => service.id)).toContain(result.primary.id);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('references the user\'s goal in the generated reasons', () => {
    const result = buildRecommendation(BASE);
    const joined = result.reasons.join(' ');
    expect(joined).toContain(BASE.goal);
  });

  it('mentions the budget in the next steps', () => {
    const result = buildRecommendation(BASE);
    expect(result.nextSteps.join(' ')).toContain(BASE.budget);
  });

  it('penalises an aggressive timeline for mobile apps', () => {
    const fast = buildRecommendation({ ...BASE, solution: 'Mobile Application', timeline: 'Within 2 weeks' });
    const relaxed = buildRecommendation({ ...BASE, solution: 'Mobile Application', timeline: '3–6 months' });
    expect(fast.matchScore).toBeLessThan(relaxed.matchScore);
  });

  it('returns additional services when signals are mixed', () => {
    const result = buildRecommendation({
      goal: 'Improve online presence',
      solution: 'Website / Web Application',
      budget: '₹50,000–₹1,00,000',
      timeline: '1–3 months',
    });
    expect(result.additional.length).toBeGreaterThan(0);
  });
});
