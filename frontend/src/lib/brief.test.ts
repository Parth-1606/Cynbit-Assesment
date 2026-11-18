/**
 * Unit tests for the project brief generator and validation rules.
 */
import { describe, it, expect } from 'vitest';
import { buildProjectBrief } from './brief';
import { validateContact, hasErrors } from './validation';
import { buildRecommendation } from './recommendation';
import type { Answers } from '../types';

const ANSWERS: Answers = {
  goal: 'Build a new digital product',
  solution: 'Website / Web Application',
  budget: '₹50,000–₹1,00,000',
  timeline: '1–3 months',
  contact: {
    name: 'Ada Sharma',
    email: 'ada@company.com',
    company: 'Acme Technologies',
    description: 'We need a customer portal with authentication, billing and reporting features.',
  },
};

const RECOMMENDATION = buildRecommendation({
  goal: ANSWERS.goal!,
  solution: ANSWERS.solution!,
  budget: ANSWERS.budget!,
  timeline: ANSWERS.timeline!,
});

describe('buildProjectBrief', () => {
  const { text, slug } = buildProjectBrief(ANSWERS, RECOMMENDATION);

  it('includes every required section', () => {
    for (const section of [
      'CUSTOMER INFORMATION',
      'BUSINESS OBJECTIVE',
      'REQUIRED SERVICES',
      'BUDGET AND TIMELINE',
      'PROJECT DESCRIPTION',
      'RECOMMENDED SOLUTION',
    ]) {
      expect(text).toContain(section);
    }
  });

  it('includes the customer details verbatim', () => {
    expect(text).toContain('Ada Sharma');
    expect(text).toContain('ada@company.com');
    expect(text).toContain('Acme Technologies');
    expect(text).toContain('Build a new digital product');
    expect(text).toContain(ANSWERS.contact.description);
  });

  it('includes budget, timeline and the recommended service', () => {
    expect(text).toContain('₹50,000–₹1,00,000');
    expect(text).toContain('1–3 months');
    expect(text).toContain(RECOMMENDATION.primary.name);
  });

  it('produces a download-safe slug', () => {
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug.length).toBeGreaterThan(0);
    expect(slug.length).toBeLessThanOrEqual(60);
  });

  it('handles a missing optional company name', () => {
    const withoutCompany = { ...ANSWERS, contact: { ...ANSWERS.contact, company: '' } };
    const brief = buildProjectBrief(withoutCompany, RECOMMENDATION);
    expect(brief.text).toContain('Not provided');
  });
});

describe('validateContact', () => {
  const valid = ANSWERS.contact;

  it('accepts a valid payload', () => {
    expect(hasErrors(validateContact(valid))).toBe(false);
  });

  it('requires name, email and description', () => {
    const errors = validateContact({ name: '', email: '', company: '', description: '' });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.description).toBeDefined();
  });

  it('rejects malformed emails', () => {
    expect(validateContact({ ...valid, email: 'not-an-email' }).email).toBeDefined();
    expect(validateContact({ ...valid, email: 'a@b' }).email).toBeDefined();
    expect(validateContact({ ...valid, email: 'a@b.c' }).email).toBeDefined();
  });

  it('accepts a real-world email', () => {
    expect(validateContact({ ...valid, email: 'user+tag@sub.domain.co.in' }).email).toBeUndefined();
  });

  it('enforces the minimum description length', () => {
    const errors = validateContact({ ...valid, description: 'too short' });
    expect(errors.description).toMatch(/at least 20 characters/);
  });

  it('allows company to be empty (optional)', () => {
    expect(validateContact({ ...valid, company: '' }).company).toBeUndefined();
  });

  it('trims whitespace before validating', () => {
    const errors = validateContact({
      ...valid,
      name: '  Ada Sharma  ',
      email: '  ada@company.com  ',
      description: '   ' + valid.description + '   ',
    });
    expect(errors.name).toBeUndefined();
    expect(errors.email).toBeUndefined();
    expect(errors.description).toBeUndefined();
  });
});
