/**
 * Step 5 - customer details form.
 * Presentational only: state and validation live in DiscoveryAssistant.
 */
import type { ContactDetails, ValidationErrors } from '../../types';
import { TextAreaField, TextField } from '../ui/FormFields';
import { DESCRIPTION_MAX_LENGTH } from '../../lib/validation';

interface ContactStepProps {
  contact: ContactDetails;
  errors: ValidationErrors;
  disabled: boolean;
  onChange: (patch: Partial<ContactDetails>) => void;
}

export function ContactStep({ contact, errors, disabled, onChange }: ContactStepProps) {
  const remaining = DESCRIPTION_MAX_LENGTH - contact.description.length;

  return (
    <div className="grid gap-4">
      <TextField
        label="Full name"
        required
        type="text"
        autoComplete="name"
        placeholder="Ada Sharma"
        value={contact.name}
        error={errors.name}
        disabled={disabled}
        onChange={(event) => onChange({ name: event.target.value })}
      />

      <TextField
        label="Email address"
        required
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="ada@company.com"
        value={contact.email}
        error={errors.email}
        disabled={disabled}
        onChange={(event) => onChange({ email: event.target.value })}
      />

      <TextField
        label="Company name"
        type="text"
        autoComplete="organization"
        placeholder="Acme Technologies Pvt. Ltd."
        value={contact.company}
        error={errors.company}
        disabled={disabled}
        onChange={(event) => onChange({ company: event.target.value })}
      />

      <TextAreaField
        label="Brief project description"
        required
        rows={5}
        placeholder="Describe what you want to build, who it is for, and any must-have requirements..."
        value={contact.description}
        error={errors.description}
        hint={
          errors.description
            ? undefined
            : `A few sentences is enough. ${remaining} characters remaining.`
        }
        disabled={disabled}
        onChange={(event) => onChange({ description: event.target.value })}
      />

      <p className="text-xs leading-relaxed text-slate-500">
        We only use these details to prepare your recommendation and follow up about your project.
        No spam, ever.
      </p>
    </div>
  );
}
