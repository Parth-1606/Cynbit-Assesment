/**
 * Cynbit Official Header Navigation
 * Matches Cynbit's clean brand aesthetic:
 * Luminous backdrop, infinity loop brandmark, elegant navigation links,
 * and pill-shaped pine-teal CTA.
 */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/wizard', label: 'Discovery Wizard' },
    { to: '/results', label: 'Estimates & Brief' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Brand: Cynbit Infinity Emblem */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex items-center justify-center px-3.5 py-1 rounded-full border border-[#044e54]/30 bg-white shadow-xs group-hover:border-[#044e54] transition-all">
            <span className="font-serif text-sm font-black tracking-widest text-[#044e54]">
              (YN
            </span>
            {/* Infinity loop SVG */}
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
          <span className="sr-only">Cynbit Technologies</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#044e54]/10 text-[#044e54] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/wizard"
            className="rounded-full bg-[#044e54] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#044e54]/20 hover:bg-[#065f67] hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Start Discovery</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-full p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl md:hidden animate-fade-in"
        >
          <ul className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-[#044e54]/10 text-[#044e54] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              to="/wizard"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#044e54] py-3 text-sm font-bold text-white shadow-md shadow-[#044e54]/25"
            >
              <span>Start Discovery</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
