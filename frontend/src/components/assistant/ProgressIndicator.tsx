/**
 * Step progress indicator for the questionnaire.
 * Shows numbered steps on desktop and a compact "Step X of Y" bar on mobile.
 */
import { Check } from 'lucide-react';
import { QUESTIONS, TOTAL_STEPS } from '../../data/questions';

interface ProgressIndicatorProps {
  /** 1-based index of the current step. */
  currentStep: number;
  /** True once recommendations have been generated. */
  completed?: boolean;
}

const STEP_LABELS = [...QUESTIONS.map((question) => question.title.replace(/^\w+\s/, '')), 'Details'];

export function ProgressIndicator({ currentStep, completed = false }: ProgressIndicatorProps) {
  const percent = completed ? 100 : Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="mb-8">
      {/* Screen-reader summary of overall progress. */}
      <p className="sr-only" role="status">
        Step {currentStep} of {TOTAL_STEPS}
        {completed ? ', complete' : ''}
      </p>

      {/* Mobile: compact bar + counter. */}
      <div className="mb-3 flex items-center justify-between md:hidden">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {completed ? 'Complete' : `Step ${currentStep} of ${TOTAL_STEPS}`}
        </span>
        <span className="text-xs font-medium text-accent-cyan">{percent}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 md:hidden"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label="Questionnaire progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Desktop: numbered steps. */}
      <ol className="hidden md:flex md:items-center" aria-label="Questionnaire steps">
        {QUESTIONS.map((question) => {
          const isDone = completed || question.step < currentStep;
          const isCurrent = !completed && question.step === currentStep;

          return (
            <li key={question.id} className="flex flex-1 items-center gap-2 last:flex-none">
              <div className="flex items-center gap-2.5">
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                    isDone
                      ? 'border-transparent bg-gradient-to-br from-accent-blue to-accent-purple text-white'
                      : isCurrent
                        ? 'border-accent-blue bg-accent-blue/15 text-accent-cyan shadow-[0_0_0_4px_rgb(59_130_246_/_0.15)]'
                        : 'border-hairline bg-white/5 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="size-4" aria-hidden="true" /> : question.step}
                </span>
                <span
                  className={`hidden text-xs font-medium lg:block ${
                    isCurrent ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {STEP_LABELS[question.step - 1]}
                </span>
              </div>

              {/* Connector line between steps. */}
              {question.step < TOTAL_STEPS - 1 && (
                <span
                  className={`h-px flex-1 transition-colors duration-300 ${
                    isDone ? 'bg-accent-indigo/60' : 'bg-white/10'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}

        {/* Step 5 (Details) sits outside QUESTIONS, so render it explicitly. */}
        <li className="flex items-center gap-2">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
              completed
                ? 'border-transparent bg-gradient-to-br from-accent-blue to-accent-purple text-white'
                : currentStep === TOTAL_STEPS
                  ? 'border-accent-blue bg-accent-blue/15 text-accent-cyan shadow-[0_0_0_4px_rgb(59_130_246_/_0.15)]'
                  : 'border-hairline bg-white/5 text-slate-500'
            }`}
            aria-current={currentStep === TOTAL_STEPS && !completed ? 'step' : undefined}
          >
            {completed ? <Check className="size-4" aria-hidden="true" /> : TOTAL_STEPS}
          </span>
          <span
            className={`hidden text-xs font-medium lg:block ${
              currentStep === TOTAL_STEPS ? 'text-white' : 'text-slate-500'
            }`}
          >
            Details
          </span>
        </li>
      </ol>
    </div>
  );
}
