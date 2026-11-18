/**
 * "How it works" - explains the flow and sets the expectation that the
 * matching logic is transparent and rule-based (not AI).
 */
import { ArrowRight, Brain, ClipboardList, FileText, Rocket } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Answer five questions',
    description:
      'Business goal, solution type, budget, timeline and a short project description. Navigate freely - your answers are preserved.',
  },
  {
    icon: Brain,
    title: 'Rule-based matching',
    description:
      'A transparent scoring model weighs each answer against Cynbit\'s six services. No black box, no AI claims - every reason is shown.',
  },
  {
    icon: FileText,
    title: 'Get your project brief',
    description:
      'A structured brief with your details, objective, services, budget and timeline - ready to copy or download as a text file.',
  },
  {
    icon: Rocket,
    title: 'Talk to the team',
    description:
      'We store your inquiry securely and follow up with a scoped proposal and a delivery plan.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-purple">
            The process
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            How the Discovery Assistant works
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            Four steps from question to proposal. The logic is deliberately simple, deterministic
            and fully explainable.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="card relative flex flex-col p-6 transition duration-300 animate-fade-up hover:border-accent-indigo/40 hover:bg-white/[0.04]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/25 to-accent-purple/25 text-accent-cyan">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-3xl font-extrabold text-white/8">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold">{step.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>

              {index < STEPS.length - 1 && (
                <ArrowRight
                  className="mt-4 hidden size-4 text-accent-purple lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
