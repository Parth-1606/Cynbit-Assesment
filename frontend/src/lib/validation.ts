/**
 * Client-side form validation for the contact step (step 5).
 * Rules mirror the backend's express-validator chains so the user sees errors
 * before a request is ever made.
 */
import type { ContactDetails, ValidationErrors } from '../types';

/** Deliberately simple but strict enough to reject disposable junk. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const DESCRIPTION_MIN_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 2000;

export function validateContact(contact: ContactDetails): ValidationErrors {
  const errors: ValidationErrors = {};

  const name = (contact.name || contact.fullName || '').trim();
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  const email = (contact.email || '').trim();
  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address, e.g. you@company.com.';
  } else if (email.length > 254) {
    errors.email = 'Email address is too long.';
  }

  const company = (contact.company || '').trim();
  if (company.length > 150) {
    errors.company = 'Company name must be 150 characters or fewer.';
  }

  const description = (contact.description || contact.projectDescription || '').trim();
  if (!description) {
    errors.description = 'Please describe your project so we can recommend accurately.';
  } else if (description.length < DESCRIPTION_MIN_LENGTH) {
    errors.description = `Please write at least ${DESCRIPTION_MIN_LENGTH} characters (${description.length}/${DESCRIPTION_MIN_LENGTH}).`;
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
