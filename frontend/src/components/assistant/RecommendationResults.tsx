/**
 * Recommendation results: matched service, rationale, next steps, project
 * summary and the copy/download project brief actions.
 */
import { useMemo, useState, type RefObject } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Copy,
  Download,
  IndianRupee,
  Info,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react';
import type { Answers, RecommendationResult, SubmissionStatus } from '../../types';
import { buildProjectBrief, copyToClipboard, downloadBrief } from '../../lib/brief';
import { useToast } from '../ui/Toast';

interface RecommendationResultsProps {
  headingRef: RefObject<HTMLHeadingElement | null>;
  answers: Answers;
  recommendation: RecommendationResult;
  status: SubmissionStatus;
  apiMessage: string | null;
  onRestart: () => void;
}

export function RecommendationResults({
  headingRef,
  answers,
  recommendation,
  status,
  apiMessage,
  onRestart,
}: RecommendationResultsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const PrimaryIcon = recommendation.primary.icon;

  const brief = useMemo(
    () => buildProjectBrief(answers, recommendation),
    [answers, recommendation],
  );

  async function handleCopy() {
    try {
      await copyToClipboard(brief.text);
      setCopied(true);
      toast('success', 'Project brief copied to clipboard.');
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast('error', 'Could not access the clipboard. Try the download button instead.');
    }
  }

  function handleDownload() {
    try {
      downloadBrief(brief.text, brief.slug);
      toast('success', 'Project brief downloaded as a text file.');
    } catch {
      toast('error', 'Download failed. Please try again.');
    }
  }

  const isSubmitting = status === 'submitting';

  return (
    <div className="animate-fade-up">
      {/* Status banner */}
      {status === 'saved' && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            Your inquiry has been saved. A Cynbit specialist will follow up at{' '}
            <strong className="font-semibold">{answers.contact.email}</strong>.
          </span>
        </div>
      )}

      {status === 'saved-without-api' && apiMessage && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-950/40 px-4 py-3 text-sm text-amber-200"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">We could not save your inquiry: </strong>
            {apiMessage} Your recommendations below are ready regardless - please try submitting
            again shortly.
          </span>
        </div>
      )}

      {/* Headline */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-extrabold outline-none sm:text-3xl"
          >
            We recommend{' '}
            <span className="bg-gradient-to-r from-accent-blue via-accent-indigo to-accent-purple bg-clip-text text-transparent">
              {recommendation.primary.name}
            </span>
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            {recommendation.primary.tagline}. Matched by transparent rule-based logic - not AI.
          </p>
        </div>

        {/* Match score badge */}
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-accent-indigo/40 bg-accent-indigo/10 px-4 py-3">
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Match score
            </p>
            <p className="text-xl font-extrabold text-white">{recommendation.matchScore}%</p>
          </div>
          <div
            className="size-10 rounded-full"
            style={{
              background: `conic-gradient(var(--color-accent-purple) ${recommendation.matchScore}%, rgb(255 255 255 / 0.12) 0)`,
            }}
            aria-hidden="true"
          >
            <div className="size-full scale-90 rounded-full bg-navy-800" />
          </div>
        </div>
      </div>

      <div className="gradient-rule my-6" />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* LEFT: primary + additional services */}
        <div className="space-y-5 lg:col-span-3">
          {/* Primary service card */}
          <div className="card relative overflow-hidden p-5">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent-blue via-accent-purple to-transparent"
              aria-hidden="true"
            />
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple text-white shadow-lg shadow-accent-indigo/30">
                <PrimaryIcon className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-cyan">
                  Primary recommendation
                </p>
                <h4 className="mt-1 text-lg font-bold">{recommendation.primary.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {recommendation.primary.description}
                </p>
              </div>
            </div>
          </div>

          {/* Why this service */}
          <div className="card p-5">
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-300">
              <BadgeCheck className="size-4 text-accent-cyan" aria-hidden="true" />
              Why this service
            </h4>
            <ul className="mt-4 space-y-3">
              {recommendation.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional services */}
          <div className="card p-5">
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-300">
              <Sparkles className="size-4 text-accent-purple" aria-hidden="true" />
              Also worth considering
            </h4>
            {recommendation.additional.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {recommendation.additional.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="rounded-xl border border-hairline bg-navy-900/60 p-3.5 transition hover:border-accent-indigo/50 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="size-4 text-accent-cyan" aria-hidden="true" />
                        <p className="text-sm font-semibold text-slate-200">{service.name}</p>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        {service.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Your answers point squarely at one service - no runner-ups this time.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: summary, budget/timeline, next steps, brief actions */}
        <div className="space-y-5 lg:col-span-2">
          {/* At-a-glance summary */}
          <div className="card p-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300">
              Project summary
            </h4>
            <dl className="mt-4 space-y-3 text-sm">
              <SummaryRow icon={Target} label="Business goal" value={answers.goal ?? '-'} />
              <SummaryRow
                icon={Sparkles}
                label="Solution needed"
                value={answers.solution ?? '-'}
              />
              <SummaryRow icon={IndianRupee} label="Budget" value={answers.budget ?? '-'} />
              <SummaryRow icon={CalendarClock} label="Timeline" value={answers.timeline ?? '-'} />
            </dl>
          </div>

          {/* Next steps */}
          <div className="card p-5">
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-300">
              <ArrowRight className="size-4 text-accent-cyan" aria-hidden="true" />
              Suggested next steps
            </h4>
            <ol className="mt-4 space-y-3">
              {recommendation.nextSteps.map((nextStep, index) => (
                <li key={nextStep} className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-indigo/20 text-[11px] font-bold text-accent-cyan">
                    {index + 1}
                  </span>
                  <span>{nextStep}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Project brief actions */}
          <div className="card p-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300">
              Project brief
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              A structured document with your details, objective, services, budget, timeline and
              recommended solution.
            </p>

            {/* Preview */}
            <pre className="mt-3 max-h-44 overflow-auto rounded-lg border border-hairline bg-navy-950/70 p-3 text-[11px] leading-relaxed text-slate-400">
              {brief.text.slice(0, 600)}
              {brief.text.length > 600 ? '\n...' : ''}
            </pre>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-4" aria-hidden="true" />
                    Copy project brief
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isSubmitting}
                className="btn-secondary w-full"
              >
                <Download className="size-4" aria-hidden="true" />
                Download as .txt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restart */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="gradient-rule w-full" />
        <button
          type="button"
          onClick={onRestart}
          disabled={isSubmitting}
          className="btn-ghost mt-2 text-slate-400"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="size-4" aria-hidden="true" />
          )}
          Restart questionnaire
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <dt className="sr-only">{label}</dt>
      <Icon className="mt-0.5 size-4 shrink-0 text-accent-purple" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <dd className="text-sm font-medium text-slate-200">{value}</dd>
      </div>
    </div>
  );
}
