/**
 * Sticky top navigation with Cynbit branding, anchor links and a
 * mobile hamburger menu.
 */
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { href: '#assistant', label: 'Discovery Assistant' },
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a backdrop once the page is scrolled for legibility.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-hairline bg-navy-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Brand — no aria-label: the accessible name must contain the visible
            text ("C Cynbit Technologies") or assistive tech announces a label
            that differs from what sighted users read. */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple font-display text-lg font-extrabold text-white shadow-lg shadow-accent-indigo/30 transition-transform duration-300 group-hover:scale-105"
          >
            C
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-extrabold tracking-tight text-white">
              Cynbit
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Technologies
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a href="#assistant" className="btn-primary hidden md:inline-flex !px-4 !py-2.5">
          <Sparkles className="size-4" aria-hidden="true" />
          Get started
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="btn-ghost !px-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-hairline bg-navy-950/95 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2">
            <a
              href="#assistant"
              onClick={() => setOpen(false)}
              className="btn-primary w-full"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Start the assistant
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
