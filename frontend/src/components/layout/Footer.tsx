/**
 * Cynbit Official Footer
 * Clean light Scandinavian design with infinity logo,
 * organized links, and muted copyright info.
 */
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex items-center justify-center px-3.5 py-1 rounded-full border border-[#044e54]/30 bg-white shadow-xs">
                <span className="font-serif text-sm font-black tracking-widest text-[#044e54]">
                  (YN
                </span>
                <svg
                  className="w-5 h-3 mx-1 text-[#044e54]"
                  viewBox="0 0 24 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2a4 4 0 0 1 0 8c-3 0-4-3-6-4-2-1-3-4-6-4a4 4 0 0 0 0 8c3 0 4-3 6-4 2 1 3 4 6 4a4 4 0 0 0 0-8z" />
                </svg>
                <span className="font-serif text-sm font-black tracking-widest text-[#044e54]">
                  BIT)
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              Cynbit Technologies architects the digital future with autonomous AI agents, custom software development, and scalable business platforms. Based in Jaipur, Rajasthan, serving clients worldwide.
            </p>

            <div className="mt-6">
              <Link to="/wizard" className="btn-primary text-xs font-bold">
                <span>Start project discovery</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Product links */}
          <nav aria-label="Product navigation">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-slate-600 transition-colors hover:text-[#044e54]">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/wizard" className="text-sm text-slate-600 transition-colors hover:text-[#044e54]">
                  Discovery Wizard
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-sm text-slate-600 transition-colors hover:text-[#044e54]">
                  Estimates & Brief
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#044e54]" aria-hidden="true" />
                <a
                  href="mailto:contact@cynbit.com"
                  className="transition-colors hover:text-[#044e54]"
                >
                  contact@cynbit.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#044e54]" aria-hidden="true" />
                <span>Jaipur, Rajasthan — India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {year} Cynbit Technologies. Prototype & Assessment Deliverable.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Deterministic Estimation Engine</span>
            <span>•</span>
            <span>INR Currency Modeling</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
