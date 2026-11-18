/**
 * Page 1: Landing Page
 * Cynbit Official Light / Pine-Teal Theme
 * Matches the official Cynbit web aesthetic:
 * - Crisp Scandinavian-style canvas with ambient teal glow
 * - Warm pill badge "THE OPTIMISTIC ARCHITECT"
 * - Dual-tone heading with italicized pine-teal emphasis
 * - Floating Neumorphic 3D radar illustration with micro-widgets
 * - Dual Ecosystem cards: Left White Infrastructure & Right Pine-Teal SaaS Suite
 * - 3 Feature Cards & 4-Step Engineering Scoping Workflow
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Calculator,
  FileText,
  Bot,
  Code2,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8">
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="pointer-events-none absolute top-10 right-10 size-[600px] rounded-full bg-[#044e54]/5 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-10 left-10 size-[500px] rounded-full bg-teal-100/40 blur-[100px]"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading, Supporting text, CTAs */}
              <div className="lg:col-span-7 z-10">
                {/* Warm Peach Pill Tag */}
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest bg-[#fef3c7] text-[#92400e] border border-[#fde68a] mb-6 shadow-xs animate-fade-in">
                  <span className="size-2 rounded-full bg-[#d97706] animate-pulse" />
                  <span>The Optimistic Architect</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-slate-900 leading-[1.08] mb-6">
                  Architecting <br className="hidden sm:inline" />
                  the future with <br />
                  <span className="text-[#044e54] italic font-serif font-black underline decoration-[#14b8a6]/40 decoration-4 underline-offset-8">
                    SaaS platforms.
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="max-w-2xl text-base sm:text-lg text-slate-600 mb-8 leading-relaxed font-normal">
                  Cynbit Technologies architects the digital future with autonomous AI agents, custom software development, and scalable business platforms. Bridge the gap between technical precision and global business growth.
                </p>

                {/* Dual Pill Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/wizard"
                    className="btn-primary text-sm font-bold shadow-lg shadow-[#044e54]/25 hover:shadow-xl hover:shadow-[#044e54]/30"
                  >
                    <span>Start discovery</span>
                    <ArrowRight className="size-4" />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="btn-secondary text-sm font-semibold"
                  >
                    <span>How it works</span>
                  </a>
                </div>

                {/* Micro trust indicators */}
                <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#044e54]" />
                    <span>Deterministic INR Costing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#044e54]" />
                    <span>Downloadable PDF Brief</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#044e54]" />
                    <span>Zero Obligation Scoping</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Neumorphic Circular 3D Radar Visual */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative size-[340px] sm:size-[420px] flex items-center justify-center">
                  {/* Concentric rings */}
                  <div className="absolute inset-0 rounded-full border border-slate-200/60 bg-gradient-to-tr from-slate-100/40 to-transparent" />
                  <div className="absolute inset-8 rounded-full border border-slate-200/50" />
                  <div className="absolute inset-16 rounded-full border border-slate-200/40" />

                  {/* Elevated Central 3D Disc */}
                  <div className="relative size-60 rounded-full bg-white shadow-[0_25px_60px_-15px_rgba(4,78,84,0.12),0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-center">
                    {/* Inner concentric ring */}
                    <div className="size-44 rounded-full border border-slate-100 bg-slate-50/50 flex items-center justify-center">
                      <div className="size-20 rounded-full bg-white shadow-inner flex items-center justify-center">
                        <Activity className="size-7 text-[#044e54]" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Widget 1 (Top Right): Automation Pill */}
                  <div className="absolute -top-2 right-2 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.06)] animate-fade-in w-44">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-6 rounded-lg bg-[#044e54] text-white flex items-center justify-center">
                        <Bot className="size-3.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#044e54]">
                        Automation
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-1.5">
                      <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-semibold text-slate-500">
                      <span>Efficiency</span>
                      <span className="text-slate-800 font-bold">95%</span>
                    </div>
                  </div>

                  {/* Floating Widget 2 (Bottom Left): Runtime Active Pill */}
                  <div className="absolute -bottom-2 left-2 sm:left-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.06)] flex items-center gap-3 animate-fade-in">
                    <div className="size-8 rounded-xl bg-[#ffedd5] text-[#9a3412] flex items-center justify-center">
                      <Terminal className="size-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Runtime
                      </div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span>Active now</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Mini Indicator (Top Left) */}
                  <div className="absolute top-16 left-6 size-9 rounded-full bg-blue-50 border border-blue-200/60 shadow-sm flex items-center justify-center text-blue-600">
                    <Layers className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FOUNDATIONAL PILLARS (Matches Image 2) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 bg-slate-50/50">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#044e54]">
                Our Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Foundational pillars.
              </h2>
              <p className="mt-2 text-slate-600 text-sm max-w-2xl">
                Integrated excellence across AI technology, full-stack software development, and organizational growth.
              </p>
            </div>

            {/* DUAL PILLARS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pillar 1: Custom IT Infrastructure (Crisp Light Card) */}
              <div className="card p-8 sm:p-10 bg-white flex flex-col justify-between">
                <div>
                  <div className="size-12 rounded-2xl bg-[#044e54]/10 text-[#044e54] flex items-center justify-center mb-6">
                    <Code2 className="size-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Custom IT infrastructure
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-8">
                    Specialized software architecture and secure cloud foundations. We engineer scalable growth engines designed to accelerate technical maturity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="text-xs font-bold text-[#044e54] uppercase tracking-wide">
                      AI Automation
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      LLM & Autonomous Agents
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="text-xs font-bold text-[#044e54] uppercase tracking-wide">
                      Software Dev
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Web, SaaS & Mobile
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="text-xs font-bold text-[#044e54] uppercase tracking-wide">
                      Cloud Systems
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      AWS, GCP & Kubernetes
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="text-xs font-bold text-[#044e54] uppercase tracking-wide">
                      Technical SEO
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Data-driven Search Growth
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Proprietary SaaS Suite (Deep Pine Teal Card) */}
              <div className="card-teal p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="size-12 rounded-2xl bg-white/15 text-white flex items-center justify-center mb-6 backdrop-blur-md">
                    <Compass className="size-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Proprietary SaaS suite
                  </h3>
                  <p className="text-teal-100/90 text-sm leading-relaxed mb-8">
                    Bespoke digital ecosystems engineered for specific market challenges, high transaction throughput, and organizational excellence.
                  </p>
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 p-3.5 flex items-center gap-3.5 transition-colors">
                    <div className="size-9 rounded-xl bg-white text-[#044e54] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      CS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        Cynbit Studio
                      </div>
                      <div className="text-[11px] text-teal-200">
                        Career Intelligence Platform
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 p-3.5 flex items-center gap-3.5 transition-colors">
                    <div className="size-9 rounded-xl bg-[#ffedd5] text-[#9a3412] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      RV
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        Revio
                      </div>
                      <div className="text-[11px] text-teal-200">
                        AI Review & Reputation Assistant
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 p-3.5 flex items-center gap-3.5 transition-colors">
                    <div className="size-9 rounded-xl bg-white text-[#044e54] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      TE
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        TenantEase
                      </div>
                      <div className="text-[11px] text-teal-200">
                        Property Operations Ecosystem
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: 3 FEATURE CARDS (Required by Assessment Specification) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/70">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#044e54]">
                Project Discovery Core Features
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Transparent Scoping & Instant Estimations
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm mt-2">
                Eliminate agency guesswork. Get clear technical recommendations, modular pricing in INR, and downloadable specifications in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-8 hover:border-[#044e54]/50 transition-all duration-300 group">
                <div className="size-12 rounded-2xl bg-[#044e54]/10 text-[#044e54] flex items-center justify-center mb-6 group-hover:bg-[#044e54] group-hover:text-white transition-all">
                  <Compass className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Smart Service Recommendation
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Identifies whether your roadmap requires Web Development, Full Stack Architecture, Mobile Apps, AI Automation, or Cloud Engineering based on your exact business goals.
                </p>
                <div className="text-xs font-bold text-[#044e54] flex items-center gap-1.5">
                  <span>Tailored Technology Fit</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card p-8 hover:border-[#044e54]/50 transition-all duration-300 group">
                <div className="size-12 rounded-2xl bg-[#044e54]/10 text-[#044e54] flex items-center justify-center mb-6 group-hover:bg-[#044e54] group-hover:text-white transition-all">
                  <Calculator className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Project Cost Estimation
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Calculates illustrative INR budgets and delivery schedules using deterministic rules based on user roles, third-party integrations, scalability, and target platforms.
                </p>
                <div className="text-xs font-bold text-[#044e54] flex items-center gap-1.5">
                  <span>Deterministic INR Modeling</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card p-8 hover:border-[#044e54]/50 transition-all duration-300 group">
                <div className="size-12 rounded-2xl bg-[#044e54]/10 text-[#044e54] flex items-center justify-center mb-6 group-hover:bg-[#044e54] group-hover:text-white transition-all">
                  <FileText className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Instant Project Brief
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Generates an executive-ready PDF brief complete with technical specifications, complexity analysis, and next steps ready to share with your team or stakeholders.
                </p>
                <div className="text-xs font-bold text-[#044e54] flex items-center gap-1.5">
                  <span>Downloadable PDF & Copy</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: 4-STEP PROCESS (Required by Assessment Specification) */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-200/60">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#044e54]">
                Simple 5-Minute Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                How It Works
              </h2>
              <p className="mt-2 text-slate-600 text-sm max-w-2xl mx-auto">
                A structured questionnaire transforms broad requirements into an actionable technical roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="card p-6 bg-white">
                <div className="text-3xl font-black text-[#044e54]/30 font-mono mb-3">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Select Business Objective
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Identify your initiative: corporate website, custom web application, mobile app, AI automation, or cloud modernization.
                </p>
              </div>

              {/* Step 2 */}
              <div className="card p-6 bg-white">
                <div className="text-3xl font-black text-[#044e54]/30 font-mono mb-3">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Configure Requirements
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Specify user roles, authentication needs, payment integrations, interactive dashboards, and external APIs dynamically.
                </p>
              </div>

              {/* Step 3 */}
              <div className="card p-6 bg-white">
                <div className="text-3xl font-black text-[#044e54]/30 font-mono mb-3">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Calculate Estimates
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Our deterministic engine computes realistic INR budget ranges, delivery duration, and provides transparent budget alignment advice.
                </p>
              </div>

              {/* Step 4 */}
              <div className="card p-6 bg-white">
                <div className="text-3xl font-black text-[#044e54]/30 font-mono mb-3">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Export PDF & Submit
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Download your formatted PDF project brief and submit your inquiry to connect directly with a Cynbit engineering architect.
                </p>
              </div>
            </div>

            {/* Bottom CTA Banner */}
            <div className="mt-16 card p-8 sm:p-10 bg-white border border-slate-200 shadow-xl text-center max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                Ready to scope your next software initiative?
              </h3>
              <p className="text-slate-600 text-sm mb-6 max-w-xl mx-auto">
                Explore the right service and get an instant, deterministic cost and timeline estimation.
              </p>
              <Link to="/wizard" className="btn-primary text-sm font-bold shadow-lg shadow-[#044e54]/25">
                <span>Start Project Discovery</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
