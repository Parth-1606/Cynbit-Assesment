/**
 * Project Discovery Assistant - the multi-step questionnaire, results and
 * project brief.
 *
 * State lives here so answers survive forward/back navigation; each step is a
 * presentational child component.
 */
import { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import { QUESTIONS, TOTAL_STEPS } from '../../data/questions';
import type {
  Answers,
  ProjectInquiryPayload,
  QuestionId,
  SubmissionStatus,
  ValidationErrors,
} from '../../types';
import { buildRecommendation } from '../../lib/recommendation';
import { hasErrors, validateContact } from '../../lib/validation';
import { ApiError, submitProjectInquiry } from '../../lib/api';
import { useToast } from '../ui/Toast';
import { ProgressIndicator } from './ProgressIndicator';
import { OptionCard } from './OptionCard';
import { ContactStep } from './ContactStep';
import { RecommendationResults } from './RecommendationResults';

const INITIAL_ANSWERS: Answers = {
  goal: null,
  solution: null,
  budget: null,
  timeline: null,
  contact: { name: '', email: '', company: '', description: '' },
};

export function DiscoveryAssistant() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [stepError, setStepError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Keeps focus on the step heading after navigation (accessibility).
  const headingRef = useRef<HTMLHeadingElement>(null);

  const question = step <= 4 ? QUESTIONS[step - 1] : null;
  const isContactStep = step === TOTAL_STEPS;

  const recommendation = useMemo(() => {
    if (!showResults || !answers.goal || !answers.solution) return null;
    return buildRecommendation({
      goal: answers.goal,
      solution: answers.solution,
      budget: answers.budget ?? 'Not decided',
      timeline: answers.timeline ?? 'Flexible',
    });
  }, [showResults, answers]);

  /** Records an answer for a multiple-choice step. */
  function selectAnswer(key: QuestionId, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStepError(null);
  }

  /** Advances one step, validating the current one first. */
  function handleNext() {
    if (question) {
      const value = answers[question.id];
      if (!value) {
        setStepError('Please select an option to continue.');
        return;
      }
    }

    setStepError(null);
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
    window.setTimeout(() => headingRef.current?.focus(), 60);
  }

  function handleBack() {
    setStepError(null);
    setFieldErrors({});
    setStep((current) => Math.max(current - 1, 1));
    window.setTimeout(() => headingRef.current?.focus(), 60);
  }

  /** Step 5 submit: validate, compute the recommendation, persist the inquiry. */
  async function handleSubmit() {
    const errors = validateContact(answers.contact);
    setFieldErrors(errors);

    if (hasErrors(errors)) {
      toast('error', 'Please fix the highlighted fields before submitting.');
      // Focus the first invalid control.
      window.setTimeout(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      }, 60);
      return;
    }

    if (!answers.goal || !answers.solution || !answers.budget || !answers.timeline) {
      setStepError('Some answers are missing. Please go back and complete every step.');
      return;
    }

    const result = buildRecommendation({
      goal: answers.goal,
      solution: answers.solution,
      budget: answers.budget,
      timeline: answers.timeline,
    });

    const payload: ProjectInquiryPayload = {
      name: (answers.contact.name || answers.contact.fullName || '').trim(),
      email: answers.contact.email.trim(),
      company: (answers.contact.company || '').trim(),
      goal: answers.goal,
      solution: answers.solution,
      budget: answers.budget,
      timeline: answers.timeline,
      description: (answers.contact.description || answers.contact.projectDescription || '').trim(),
      recommendation: result.primary.name,
    };

    setStatus('submitting');
    setApiMessage(null);

    // The recommendation never depends on the API, so results are shown even
    // if persistence fails - but the user is told clearly.
    try {
      await submitProjectInquiry(payload);
      setStatus('saved');
      toast('success', 'Thanks! Your project inquiry has been saved.');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Something went wrong while saving your inquiry.';
      setStatus('saved-without-api');
      setApiMessage(message);
      toast('error', `${message} Your recommendations are still shown below.`);
    }

    setShowResults(true);
    window.setTimeout(() => headingRef.current?.focus(), 60);
  }

  /** Resets everything back to step 1. */
  function handleRestart() {
    setAnswers(INITIAL_ANSWERS);
    setStep(1);
    setStepError(null);
    setFieldErrors({});
    setStatus('idle');
    setApiMessage(null);
    setShowResults(false);
    toast('info', 'Questionnaire restarted.');
    window.setTimeout(() => headingRef.current?.focus(), 60);
  }

  const isSubmitting = status === 'submitting';

  return (
    <section
      id="assistant"
      className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="assistant-heading"
    >
      {/* Ambient glow behind the card */}
      <div
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-accent-indigo/25 blur-[110px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl">
        {/* Section header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-purple/35 bg-accent-purple/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-purple">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Project Discovery Assistant
          </span>
          <h2
            id="assistant-heading"
            className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Find the right service for{' '}
            <span className="bg-gradient-to-r from-accent-blue via-accent-indigo to-accent-purple bg-clip-text text-transparent">
              your project
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Answer five short questions. Our transparent rule-based engine matches your answers
            against Cynbit&apos;s service catalogue and produces a project brief you can send
            straight to our team.
          </p>
        </div>

        {/* Main card */}
        <div className="card relative overflow-hidden p-5 shadow-[0_40px_90px_-40px_rgb(0_0_0_/_0.9)] sm:p-8">
          {/* Decorative top edge */}
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/70 to-transparent"
            aria-hidden="true"
          />

          {showResults && recommendation ? (
            <RecommendationResults
              headingRef={headingRef}
              answers={answers}
              recommendation={recommendation}
              status={status}
              apiMessage={apiMessage}
              onRestart={handleRestart}
            />
          ) : (
            <>
              <ProgressIndicator currentStep={step} />

              <div className="animate-fade-up">
                {/* Step heading (focus target after navigation). */}
                <div className="mb-6 flex items-start gap-3">
                  {question && (
                    <span
                      className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/25 to-accent-purple/25 text-accent-cyan"
                      aria-hidden="true"
                    >
                      <question.icon className="size-5" />
                    </span>
                  )}
                  <div>
                    <h3
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-lg font-bold leading-snug outline-none sm:text-xl"
                    >
                      {question ? question.title : 'Tell us about yourself'}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {question
                        ? question.description
                        : 'Almost done - these details let us follow up with a tailored proposal.'}
                    </p>
                  </div>
                </div>

                {/* Options grid (steps 1-4) */}
                {question && (
                  <fieldset>
                    <legend className="sr-only">{question.title}</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {question.options.map((option) => (
                        <OptionCard
                          key={option.value}
                          option={option}
                          name={question.id}
                          selected={answers[question.id] === option.value}
                          onSelect={(value) => selectAnswer(question.id, value)}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}

                {/* Contact form (step 5) */}
                {isContactStep && (
                  <ContactStep
                    contact={answers.contact}
                    errors={fieldErrors}
                    disabled={isSubmitting}
                    onChange={(patch) => {
                      setAnswers((current) => ({
                        ...current,
                        contact: { ...current.contact, ...patch },
                      }));
                      // Clear the touched field's error as the user types.
                      setFieldErrors((current) => {
                        const next = { ...current };
                        for (const key of Object.keys(patch)) {
                          delete next[key as keyof ValidationErrors];
                        }
                        return next;
                      });
                    }}
                  />
                )}

                {/* Inline step-level error */}
                {stepError && (
                  <p role="alert" className="mt-4 text-sm font-medium text-rose-400">
                    {stepError}
                  </p>
                )}

                {/* Navigation */}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1 || isSubmitting}
                    className="btn-ghost"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back
                  </button>

                  {isContactStep ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="btn-primary min-w-52"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Send className="size-4" aria-hidden="true" />
                          Get my recommendation
                        </>
                      )}
                    </button>
                  ) : (
                    <button type="button" onClick={handleNext} className="btn-primary">
                      Continue
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Progress hint */}
                {!isContactStep && (
                  <p className="mt-5 text-center text-xs text-slate-500">
                    Your answers are kept as you move between steps - you can go back at any time.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Restart control shown outside the card once results exist */}
        {showResults && (
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={handleRestart} className="btn-ghost text-slate-400">
              <RefreshCw className="size-4" aria-hidden="true" />
              Start over with a new project
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
