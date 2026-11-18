/**
 * Hero section: value proposition, primary CTA and trust indicators.
 */
import { ArrowRight, CheckCircle2, Clock3, Sparkles, TrendingUp } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: CheckCircle2, text: '5 questions, under 60 seconds' },
  { icon: TrendingUp, text: 'Transparent rule-based matching' },
  { icon: Clock3, text: 'Instant downloadable project brief' },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
      {/* Decorative orbs */}
      <div
        className="pointer-events-none absolute -left-24 top-24 -z-10 size-72 rounded-full bg-accent-blue/25 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-40 -z-10 size-80 rounded-full bg-accent-purple/25 blur-[110px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-accent-blue/35 bg-accent-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan">
            <Sparkles className="size-3.5" aria-hidden="true" />
            New: Project Discovery Assistant
          </span>

          <h1 className="mt-6 animate-fade-up text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            Discover the perfect{' '}
            <span className="bg-gradient-to-r from-accent-blue via-accent-indigo to-accent-purple bg-clip-text text-transparent">
              tech solution
            </span>{' '}
            for your business
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-slate-400 sm:text-lg [animation-delay:160ms]"
          >
            Answer five short questions about your goals, budget and timeline. Cynbit&apos;s
            Project Discovery Assistant matches you with the right service and builds a ready-to-send
            project brief - instantly.
          </p>

          {/* CTAs */}
          <div
            className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:240ms]"
          >
            <a href="#assistant" className="btn-primary w-full px-7 py-4 text-base sm:w-auto">
              Start the discovery assistant
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            <a href="#services" className="btn-secondary w-full px-7 py-4 text-base sm:w-auto">
              Explore our services
            </a>
          </div>

          {/* Highlights */}
          <ul
            className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-x-6 gap-y-3 [animation-delay:320ms]"
          >
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight.text} className="flex items-center gap-2 text-sm text-slate-400">
                <highlight.icon className="size-4 text-emerald-400" aria-hidden="true" />
                {highlight.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Stat strip */}
        <dl
          className="mx-auto mt-14 grid max-w-4xl animate-fade-up grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 [animation-delay:400ms]"
        >
          {[
            { value: '5', label: 'Guided questions' },
            { value: '6', label: 'Services matched' },
            { value: '<60s', label: 'To a recommendation' },
            { value: '1', label: 'Downloadable brief' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card flex flex-col items-center px-4 py-5 text-center transition hover:border-accent-indigo/40 hover:bg-white/[0.04]"
            >
              <dd className="order-1 bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="order-2 mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
