/**
 * Page 2: Project Discovery Wizard
 * Cynbit Official Light / Pine-Teal Theme
 * 5-Step interactive questionnaire with dynamic requirements,
 * React Hook Form + Zod validation, and state preservation.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Globe,
  Code2,
  Smartphone,
  Bot,
  Cpu,
  Cloud,
  Megaphone,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useProjectDiscovery } from '../hooks/useProjectDiscovery';
import {
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
  type BusinessObjective,
} from '../types';

// Step 5 Contact Details Validation Schema
const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name cannot exceed 100 characters' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid work email address' })
    .max(254, { message: 'Email address is too long' }),
  company: z.string().max(150, { message: 'Company name too long' }).optional(),
  projectDescription: z
    .string()
    .min(20, { message: 'Project description must be at least 20 characters' })
    .max(3000, { message: 'Description cannot exceed 3000 characters' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const WizardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    objective,
    setObjective,
    requirements,
    setRequirements,
    budget,
    setBudget,
    timeline,
    setTimeline,
    contact,
    setContact,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
  } = useProjectDiscovery();

  const [validationError, setValidationError] = useState<string | null>(null);

  // React Hook Form for Step 5
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: contact.fullName || '',
      email: contact.email || '',
      company: contact.company || '',
      projectDescription: contact.projectDescription || '',
    },
  });

  // Step 1 Objectives config
  const objectiveCards = [
    {
      id: 'Build a website' as BusinessObjective,
      title: 'Build a website',
      desc: 'High-conversion corporate sites, landing pages, and content platforms.',
      icon: Globe,
    },
    {
      id: 'Develop a web application' as BusinessObjective,
      title: 'Develop a web application',
      desc: 'SaaS platforms, dynamic customer portals, and internal business tools.',
      icon: Code2,
    },
    {
      id: 'Develop a mobile application' as BusinessObjective,
      title: 'Develop a mobile application',
      desc: 'iOS and Android mobile apps engineered for fluid performance.',
      icon: Smartphone,
    },
    {
      id: 'Automate business operations' as BusinessObjective,
      title: 'Automate business operations',
      desc: 'Workflow automation, document processing, and AI integrations.',
      icon: Bot,
    },
    {
      id: 'Implement AI solutions' as BusinessObjective,
      title: 'Implement AI solutions',
      desc: 'Custom LLM agents, intelligent chatbots, and predictive algorithms.',
      icon: Cpu,
    },
    {
      id: 'Improve cloud infrastructure' as BusinessObjective,
      title: 'Improve cloud infrastructure',
      desc: 'Cloud migrations, CI/CD pipelines, autoscaling, and container setups.',
      icon: Cloud,
    },
    {
      id: 'Improve digital marketing' as BusinessObjective,
      title: 'Improve digital marketing',
      desc: 'SEO optimization, paid acquisition funnels, and performance marketing.',
      icon: Megaphone,
    },
  ];

  // Handler for Next navigation with per-step validation
  const handleNext = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!objective) {
        setValidationError('Please select a business objective to proceed.');
        return;
      }
      nextStep();
    } else if (currentStep === 2) {
      if (objective === 'Build a website' && !requirements.pages) {
        setValidationError('Please select the estimated number of pages.');
        return;
      }
      nextStep();
    } else if (currentStep === 3) {
      if (!budget) {
        setValidationError('Please select a target budget range to proceed.');
        return;
      }
      nextStep();
    } else if (currentStep === 4) {
      if (!timeline) {
        setValidationError('Please select a target delivery timeline to proceed.');
        return;
      }
      nextStep();
    }
  };

  const onContactSubmit = (data: ContactFormData) => {
    setContact({
      fullName: data.fullName,
      email: data.email,
      company: data.company || '',
      projectDescription: data.projectDescription,
    });
    navigate('/results');
  };

  const stepTitles = [
    'Business Objective',
    'Project Requirements',
    'Target Budget',
    'Delivery Timeline',
    'Contact & Overview',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-slate-800">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              <span>
                Step {currentStep} of 5: <span className="text-slate-900">{stepTitles[currentStep - 1]}</span>
              </span>
              <span className="text-[#044e54] font-mono">{currentStep * 20}% completed</span>
            </div>

            {/* Progress Bar Track */}
            <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
              <div
                className="h-full bg-[#044e54] transition-all duration-300 rounded-full"
                style={{ width: `${currentStep * 20}%` }}
              />
            </div>

            {/* Stepper Dots */}
            <div className="hidden sm:flex justify-between items-center mt-3 px-1">
              {stepTitles.map((title, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => {
                      if (stepNum < currentStep || (stepNum === 2 && objective)) {
                        setCurrentStep(stepNum);
                      }
                    }}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      isCurrent
                        ? 'text-[#044e54] font-bold'
                        : isCompleted
                        ? 'text-slate-700 hover:text-slate-900'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#044e54] text-white shadow-xs'
                          : isCompleted
                          ? 'bg-[#044e54]/15 text-[#044e54] font-bold'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="size-3" /> : stepNum}
                    </span>
                    <span className="hidden md:inline">{title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="mb-6 card p-4 border-rose-300 bg-rose-50 text-rose-800 flex items-center gap-3 text-sm animate-fade-in">
              <AlertCircle className="size-5 text-rose-600 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* QUESTIONNAIRE BODY */}
          <div className="card p-6 sm:p-10 bg-white border border-slate-200 shadow-xl">
            {/* STEP 1: BUSINESS OBJECTIVE */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    What is your core business objective?
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Select the option that best reflects your strategic engineering goal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {objectiveCards.map((card) => {
                    const isSelected = objective === card.id;
                    const Icon = card.icon;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => {
                          setObjective(card.id);
                          setValidationError(null);
                        }}
                        className={`text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                          isSelected
                            ? 'bg-[#044e54]/5 border-[#044e54] ring-2 ring-[#044e54]/30 shadow-md'
                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div
                          className={`size-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#044e54] text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-[#044e54]'
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 text-base mb-1 flex items-center justify-between">
                            <span>{card.title}</span>
                            {isSelected && (
                              <div className="size-5 rounded-full bg-[#044e54] text-white flex items-center justify-center">
                                <Check className="size-3" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: PROJECT REQUIREMENTS (DYNAMIC) */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#044e54] mb-1">
                    <Sparkles className="size-3.5" />
                    <span>Technical Scoping: {objective}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Configure your project requirements
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Specify the technical capabilities needed so we can calculate an accurate estimate.
                  </p>
                </div>

                {/* 1. Website Dynamic Questions */}
                {objective === 'Build a website' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        Estimated Number of Pages
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['1–5 pages', '5–15 pages', '15+ pages'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRequirements((prev) => ({ ...prev, pages: opt }))}
                            className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                              requirements.pages === opt
                                ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54] ring-1 ring-[#044e54]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Authentication Required?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Yes', 'No'] as const).map((ans) => (
                            <button
                              key={ans}
                              type="button"
                              onClick={() => setRequirements((prev) => ({ ...prev, authRequired: ans }))}
                              className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                                requirements.authRequired === ans
                                  ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                              }`}
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Payment Integration?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Yes', 'No'] as const).map((ans) => (
                            <button
                              key={ans}
                              type="button"
                              onClick={() => setRequirements((prev) => ({ ...prev, paymentIntegration: ans }))}
                              className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                                requirements.paymentIntegration === ans
                                  ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                              }`}
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Admin Dashboard?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Yes', 'No'] as const).map((ans) => (
                            <button
                              key={ans}
                              type="button"
                              onClick={() => setRequirements((prev) => ({ ...prev, adminDashboard: ans }))}
                              className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                                requirements.adminDashboard === ans
                                  ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                              }`}
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Web Application Dynamic Questions */}
                {objective === 'Develop a web application' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        User Roles Architecture
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['Single role', 'Multi-role', 'Complex RBAC'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRequirements((prev) => ({ ...prev, userRoles: opt }))}
                            className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                              requirements.userRoles === opt
                                ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54] ring-1 ring-[#044e54]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        Dashboard Requirements
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(
                          [
                            'Basic analytics',
                            'Advanced interactive dashboards',
                            'Custom reporting',
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRequirements((prev) => ({ ...prev, dashboardRequirements: opt }))}
                            className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                              requirements.dashboardRequirements === opt
                                ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54] ring-1 ring-[#044e54]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        Database Requirements
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(
                          [
                            'Relational / SQL',
                            'Document / NoSQL',
                            'Scalability requirements',
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRequirements((prev) => ({ ...prev, databaseRequirements: opt }))}
                            className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                              requirements.databaseRequirements === opt
                                ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54] ring-1 ring-[#044e54]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        Third-Party Integrations (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Payment Gateway', 'CRM / ERP', 'External REST APIs', 'Webhooks & Notifications'].map(
                          (item) => {
                            const list = requirements.thirdPartyIntegrations || [];
                            const isChecked = list.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  const updated = isChecked
                                    ? list.filter((x) => x !== item)
                                    : [...list, item];
                                  setRequirements((prev) => ({
                                    ...prev,
                                    thirdPartyIntegrations: updated,
                                  }));
                                }}
                                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                                  isChecked
                                    ? 'bg-[#044e54] text-white border-[#044e54] shadow-xs'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                                }`}
                              >
                                <span>{item}</span>
                                {isChecked && <Check className="size-3.5 text-white" />}
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Mobile Application Dynamic Questions */}
                {objective === 'Develop a mobile application' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        Target Platforms
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['Android', 'iOS', 'Both platforms'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRequirements((prev) => ({ ...prev, platforms: opt }))}
                            className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                              requirements.platforms === opt
                                ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54] ring-1 ring-[#044e54]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Authentication Required?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Yes', 'No'] as const).map((ans) => (
                            <button
                              key={ans}
                              type="button"
                              onClick={() => setRequirements((prev) => ({ ...prev, mobileAuth: ans }))}
                              className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                                requirements.mobileAuth === ans
                                  ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                              }`}
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Payment Integration?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Yes', 'No'] as const).map((ans) => (
                            <button
                              key={ans}
                              type="button"
                              onClick={() => setRequirements((prev) => ({ ...prev, mobilePayment: ans }))}
                              className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                                requirements.mobilePayment === ans
                                  ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                              }`}
                            >
                              {ans}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. AI Automation Dynamic Questions */}
                {(objective === 'Automate business operations' || objective === 'Implement AI solutions') && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Select Required Capabilities
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'aiChatbot' as const, label: 'AI Chatbot & Virtual Assistant' },
                        { key: 'workflowAutomation' as const, label: 'Intelligent Workflow Automation' },
                        { key: 'documentProcessing' as const, label: 'Automated Document Processing' },
                        { key: 'customAiIntegration' as const, label: 'Custom AI / LLM Model Integration' },
                      ].map((item) => {
                        const isChecked = !!requirements[item.key];
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() =>
                              setRequirements((prev) => ({ ...prev, [item.key]: !isChecked }))
                            }
                            className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-[#044e54] text-white border-[#044e54] shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <span>{item.label}</span>
                            <div
                              className={`size-5 rounded flex items-center justify-center border ${
                                isChecked
                                  ? 'bg-white text-[#044e54]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="size-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Cloud Infrastructure Dynamic Questions */}
                {objective === 'Improve cloud infrastructure' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Select Cloud Engineering Scope
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'cloudMigration' as const, label: 'Cloud Migration (AWS / GCP / Azure)' },
                        { key: 'deployment' as const, label: 'Automated CI/CD Deployment' },
                        { key: 'infrastructureOptimization' as const, label: 'Infrastructure & Cost Optimization' },
                        { key: 'scalabilityRequirements' as const, label: 'High Availability & Scalability' },
                      ].map((item) => {
                        const isChecked = !!requirements[item.key];
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() =>
                              setRequirements((prev) => ({ ...prev, [item.key]: !isChecked }))
                            }
                            className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-[#044e54] text-white border-[#044e54] shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <span>{item.label}</span>
                            <div
                              className={`size-5 rounded flex items-center justify-center border ${
                                isChecked
                                  ? 'bg-white text-[#044e54]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="size-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. Digital Marketing Dynamic Questions */}
                {objective === 'Improve digital marketing' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Select Growth Channels
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'seo' as const, label: 'SEO & Technical Search Visibility' },
                        { key: 'socialMediaMarketing' as const, label: 'Social Media Marketing' },
                        { key: 'paidAdvertising' as const, label: 'Paid Advertising (Google & Meta Ads)' },
                        { key: 'contentMarketing' as const, label: 'Content Marketing & Funnels' },
                      ].map((item) => {
                        const isChecked = !!requirements[item.key];
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() =>
                              setRequirements((prev) => ({ ...prev, [item.key]: !isChecked }))
                            }
                            className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-[#044e54] text-white border-[#044e54] shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <span>{item.label}</span>
                            <div
                              className={`size-5 rounded flex items-center justify-center border ${
                                isChecked
                                  ? 'bg-white text-[#044e54]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="size-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: BUDGET */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    What is your anticipated budget?
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Select your investment range in INR. This helps us ensure financial alignment with your scope.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = budget === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setBudget(opt);
                          setValidationError(null);
                        }}
                        className={`p-5 rounded-2xl border text-left font-bold text-base transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54] ring-2 ring-[#044e54]/30 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="size-5 rounded-full bg-[#044e54] text-white flex items-center justify-center">
                            <Check className="size-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: TIMELINE */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    What is your target delivery timeline?
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Indicate when you would like this project deployed and operational.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {TIMELINE_OPTIONS.map((opt) => {
                    const isSelected = timeline === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setTimeline(opt);
                          setValidationError(null);
                        }}
                        className={`p-5 rounded-2xl border text-left font-bold text-base transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#044e54]/10 border-[#044e54] text-[#044e54] ring-2 ring-[#044e54]/30 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="size-5 rounded-full bg-[#044e54] text-white flex items-center justify-center">
                            <Check className="size-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: CONTACT DETAILS */}
            {currentStep === 5 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Final Step: Your Contact Information
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Provide your details so we can personalize your estimate brief and prepare engineering next steps.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-bold text-slate-800 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="e.g. Parth Pawar"
                        {...register('fullName')}
                        className={`w-full rounded-2xl bg-slate-50 border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors ${
                          errors.fullName
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-300 focus:border-[#044e54]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-1.5">
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="e.g. parth@example.com"
                        {...register('email')}
                        className={`w-full rounded-2xl bg-slate-50 border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors ${
                          errors.email
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-300 focus:border-[#044e54]'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-bold text-slate-800 mb-1.5">
                      Company / Organization <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="e.g. Acme Technologies"
                      {...register('company')}
                      className="w-full rounded-2xl bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#044e54] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-bold text-slate-800 mb-1.5">
                      Project Description & Goals <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="projectDescription"
                      rows={4}
                      placeholder="Describe your vision, target audience, key integrations, or existing systems (min 20 characters)..."
                      {...register('projectDescription')}
                      className={`w-full rounded-2xl bg-slate-50 border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors ${
                        errors.projectDescription
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-[#044e54]'
                      }`}
                    />
                    {errors.projectDescription && (
                      <p className="mt-1 text-xs text-rose-600">{errors.projectDescription.message}</p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary px-6 py-3 text-sm flex items-center gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="btn-primary px-8 py-3.5 text-base font-bold flex items-center gap-2 shadow-lg shadow-[#044e54]/25"
                    >
                      <span>View Estimates & Brief</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Stepper Bottom Navigation for Steps 1 - 4 */}
            {currentStep < 5 && (
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary px-6 py-3 text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary px-7 py-3 text-sm font-bold flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
