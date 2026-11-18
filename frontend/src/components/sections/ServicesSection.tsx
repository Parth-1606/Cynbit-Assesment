/**
 * Services catalogue section - surfaces every service the assistant can
 * recommend so visitors can browse even before taking the questionnaire.
 */
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { SERVICES } from '../../data/services';

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-purple">
            What we build
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Services the assistant can recommend
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            Every recommendation is drawn from this catalogue. Each service is delivered by a
            dedicated Cynbit team with a proven delivery process.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className="group card relative flex flex-col overflow-hidden p-6 transition-all duration-300 animate-fade-up hover:-translate-y-1 hover:border-accent-indigo/50 hover:shadow-[0_30px_60px_-30px_rgb(99_102_241_/_0.6)]"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Hover gradient bar */}
                <div
                  className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-accent-blue to-accent-purple transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden="true"
                />

                <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/25 to-accent-purple/25 text-accent-cyan transition-all duration-300 group-hover:from-accent-blue group-hover:to-accent-purple group-hover:text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-base font-bold">{service.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent-purple">
                  {service.tagline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {service.description}
                </p>

                <a
                  href="#assistant"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan transition-colors hover:text-white"
                >
                  Match me to this service
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </article>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <Sparkles className="size-3.5 text-accent-purple" aria-hidden="true" />
          Not sure which one you need? The assistant decides for you in under a minute.
        </p>
      </div>
    </section>
  );
}
