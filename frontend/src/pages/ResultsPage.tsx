/**
 * Page 3: Results Page
 * Cynbit Official Light / Pine-Teal Theme
 * Displays personalized recommendations, deterministic estimates in INR,
 * budget alignment transparency, and all 5 working action buttons.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Download,
  Copy,
  Edit3,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  Layers,
  Sparkles,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useProjectDiscovery } from '../hooks/useProjectDiscovery';
import { useToast } from '../components/ui/Toast';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    objective,
    requirements,
    budget,
    timeline,
    contact,
    estimate,
    setCurrentStep,
    resetWizard,
    submitInquiry,
    downloadPdf,
    copySummaryToClipboard,
    isSubmitting,
    isSubmitted,
    submittedId,
    apiError,
  } = useProjectDiscovery();

  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // If user lands directly without completing questionnaire, provide redirect CTA
  if (!objective || !estimate) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas text-slate-800">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="card p-10 max-w-lg bg-white border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No Active Assessment Found</h2>
            <p className="text-slate-600 text-sm mb-6">
              Please complete the 5-step Project Discovery Wizard to generate your personalized engineering estimates and brief.
            </p>
            <Link to="/wizard" className="btn-primary px-6 py-3">
              Start Project Discovery
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle Copy Action
  const handleCopy = async () => {
    const success = await copySummaryToClipboard();
    if (success) {
      setCopied(true);
      showToast('Project summary copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast('Could not copy to clipboard. Please try again.', 'error');
    }
  };

  // Handle PDF Download
  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    try {
      downloadPdf();
      showToast('Project brief PDF downloaded successfully!', 'success');
    } catch {
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  // Handle Submit Inquiry
  const handleSubmit = async () => {
    const success = await submitInquiry();
    if (success) {
      showToast('Inquiry submitted successfully! A Cynbit lead architect will reach out shortly.', 'success');
    } else {
      showToast(apiError || 'Failed to submit inquiry. Check network or database status.', 'error');
    }
  };

  const handleEdit = () => {
    setCurrentStep(2);
    navigate('/wizard');
  };

  const handleStartAgain = () => {
    resetWizard();
    navigate('/wizard');
  };

  // Helper to extract selected requirements list for badges
  const requirementBadges: string[] = [];
  if (requirements.pages) requirementBadges.push(`Scale: ${requirements.pages}`);
  if (requirements.authRequired) requirementBadges.push(`Auth: ${requirements.authRequired}`);
  if (requirements.paymentIntegration) requirementBadges.push(`Payments: ${requirements.paymentIntegration}`);
  if (requirements.adminDashboard) requirementBadges.push(`Admin Dashboard: ${requirements.adminDashboard}`);
  if (requirements.userRoles) requirementBadges.push(`Roles: ${requirements.userRoles}`);
  if (requirements.dashboardRequirements) requirementBadges.push(`Dashboards: ${requirements.dashboardRequirements}`);
  if (requirements.databaseRequirements) requirementBadges.push(`Database: ${requirements.databaseRequirements}`);
  if (requirements.thirdPartyIntegrations) {
    requirements.thirdPartyIntegrations.forEach((item) => requirementBadges.push(item));
  }
  if (requirements.platforms) requirementBadges.push(`Platforms: ${requirements.platforms}`);
  if (requirements.mobileAuth) requirementBadges.push(`Mobile Auth: ${requirements.mobileAuth}`);
  if (requirements.mobilePayment) requirementBadges.push(`Mobile Payments: ${requirements.mobilePayment}`);
  if (requirements.aiChatbot) requirementBadges.push('AI Chatbot');
  if (requirements.workflowAutomation) requirementBadges.push('Workflow Automation');
  if (requirements.documentProcessing) requirementBadges.push('Document Processing');
  if (requirements.customAiIntegration) requirementBadges.push('Custom AI Model');
  if (requirements.cloudMigration) requirementBadges.push('Cloud Migration');
  if (requirements.deployment) requirementBadges.push('CI/CD Deployment');
  if (requirements.infrastructureOptimization) requirementBadges.push('Infra Optimization');
  if (requirements.scalabilityRequirements) requirementBadges.push('High Scalability');
  if (requirements.seo) requirementBadges.push('SEO Visibility');
  if (requirements.socialMediaMarketing) requirementBadges.push('Social Marketing');
  if (requirements.paidAdvertising) requirementBadges.push('Paid Ads');
  if (requirements.contentMarketing) requirementBadges.push('Content Funnels');

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header Greeting Banner */}
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#044e54] mb-2">
                <Sparkles className="size-3.5" />
                <span>Discovery Assessment Completed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Hello, {contact.fullName || 'Valued Partner'}
              </h1>
              <p className="mt-1 text-slate-600 text-sm">
                Here is your customized engineering recommendation and cost estimation for {contact.company ? `"${contact.company}"` : 'your initiative'}.
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="btn-primary !px-5 !py-2.5 text-xs font-bold flex items-center gap-2"
              >
                {downloadingPdf ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-secondary !px-5 !py-2.5 text-xs font-semibold flex items-center gap-2"
              >
                {copied ? <CheckCircle2 className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>

          {/* Submission Success Banner */}
          {isSubmitted && (
            <div className="mb-8 card p-5 border-emerald-300 bg-emerald-50 text-emerald-900 flex items-start gap-3.5 animate-fade-in">
              <FileCheck className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Inquiry Submitted Successfully!</h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Your project discovery record has been stored in Cynbit's database{submittedId ? ` (ID: ${submittedId})` : ''}. A dedicated engineering lead will review your specifications and contact you at <span className="underline font-bold text-slate-900">{contact.email}</span>.
                </p>
              </div>
            </div>
          )}

          {/* Submission Error Banner */}
          {apiError && !isSubmitted && (
            <div className="mb-8 card p-4 border-amber-300 bg-amber-50 text-amber-900 flex items-center gap-3 text-sm animate-fade-in">
              <AlertTriangle className="size-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Notice: </span>
                <span>{apiError}</span>
              </div>
            </div>
          )}

          {/* GRID: Service Recommendation Card + Estimates Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Primary Recommended Service Card (Deep Pine Teal Card) */}
            <div className="lg:col-span-2 card-teal p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between">
              <div
                className="pointer-events-none absolute -right-20 -bottom-20 size-64 rounded-full bg-white/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-200">
                    Recommended Cynbit Service
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                      estimate.projectComplexity === 'Enterprise'
                        ? 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                        : estimate.projectComplexity === 'High'
                        ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                        : estimate.projectComplexity === 'Moderate'
                        ? 'bg-teal-400/20 text-teal-100 border-teal-300/40'
                        : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                    }`}
                  >
                    {estimate.projectComplexity} Complexity
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  {estimate.recommendedService}
                </h2>

                <div className="mb-6">
                  <h3 className="text-xs font-bold text-teal-200 uppercase tracking-wider mb-2">
                    Why this service is recommended:
                  </h3>
                  <p className="text-teal-50 text-sm leading-relaxed">
                    {estimate.whyRecommended}
                  </p>
                </div>
              </div>

              {/* Selected Requirements Tag Cloud */}
              <div className="relative z-10 pt-4 border-t border-white/15">
                <h3 className="text-xs font-bold text-teal-200 uppercase tracking-wider mb-2.5">
                  Selected Scope & Features:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {requirementBadges.length > 0 ? (
                    requirementBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white"
                      >
                        <CheckCircle2 className="size-3 text-teal-300" />
                        <span>{badge}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-teal-200 italic">
                      Standard core requirements configured.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Estimates Metric Box (Clean White Card) */}
            <div className="card p-8 bg-white border border-slate-200 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#044e54] mb-5 block">
                  Indicative Estimates
                </span>

                {/* Estimated Budget Metric */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <IndianRupee className="size-3.5 text-[#044e54]" />
                    <span className="font-semibold">Estimated Budget Range</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {estimate.estimatedBudget}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Stated budget: <span className="text-slate-800 font-semibold">{budget}</span>
                  </div>
                </div>

                {/* Estimated Timeline Metric */}
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Clock className="size-3.5 text-[#044e54]" />
                    <span className="font-semibold">Estimated Timeline</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {estimate.estimatedDuration}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Stated timeline: <span className="text-slate-800 font-semibold">{timeline}</span>
                  </div>
                </div>
              </div>

              {/* Indicative Disclaimer Pill */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-tight">
                * Indicative engineering estimate based on configured parameters. Not an official binding Cynbit quotation.
              </div>
            </div>
          </div>

          {/* Transparent Budget Conflict Notice (if applicable) */}
          {estimate.budgetConflictNote && (
            <div className="mb-8 card p-5 border-[#fed7aa] bg-[#fffbeb] text-[#9a3412] flex items-start gap-3.5">
              <AlertTriangle className="size-5 text-[#d97706] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#7c2d12] text-sm">Budget Alignment Advisory</h4>
                <p className="text-xs text-[#9a3412] mt-1 leading-relaxed">
                  {estimate.budgetConflictNote}
                </p>
              </div>
            </div>
          )}

          {/* Project Summary & Recommended Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Project Summary */}
            <div className="card p-7 bg-white border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="size-4 text-[#044e54]" />
                <span>Project Summary</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {estimate.summary}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 italic">
                "{contact.projectDescription}"
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="card p-7 bg-white border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Recommended Next Steps</span>
              </h3>
              <ul className="space-y-3">
                {estimate.recommendedNextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="size-5 rounded-full bg-[#044e54]/10 text-[#044e54] font-bold font-mono flex items-center justify-center flex-shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Working Bottom Buttons Bar */}
          <div className="card p-6 bg-white border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Button 1: Download PDF Project Brief */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="btn-primary text-xs font-bold"
              >
                {downloadingPdf ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                <span>Download PDF Brief</span>
              </button>

              {/* Button 2: Copy Project Summary */}
              <button
                type="button"
                onClick={handleCopy}
                className="btn-secondary text-xs font-semibold"
              >
                {copied ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
              </button>

              {/* Button 3: Edit Requirements */}
              <button
                type="button"
                onClick={handleEdit}
                className="btn-secondary text-xs font-semibold"
              >
                <Edit3 className="size-4" />
                <span>Edit Requirements</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Button 4: Submit Inquiry */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmitted}
                className={`btn px-7 py-3 text-xs font-bold transition-all ${
                  isSubmitted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-700" />
                    <span>Inquiry Submitted</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>

              {/* Button 5: Start Again */}
              <button
                type="button"
                onClick={handleStartAgain}
                className="btn-ghost text-xs text-slate-500 hover:text-slate-900"
              >
                <RotateCcw className="size-4" />
                <span>Start Again</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
