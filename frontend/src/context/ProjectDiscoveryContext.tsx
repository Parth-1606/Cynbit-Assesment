/**
 * Global Context for Cynbit Project Discovery Wizard & Estimator.
 */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  BusinessObjective,
  BudgetOption,
  TimelineOption,
  DynamicRequirements,
  ContactDetails,
  EstimationResult,
} from '../types';
import { calculateProjectEstimate } from '../utils/estimationEngine';
import { submitProjectInquiry } from '../services/api';
import { generateProjectBriefPdf } from '../services/pdfService';

interface ProjectDiscoveryContextType {
  objective: BusinessObjective | null;
  requirements: DynamicRequirements;
  budget: BudgetOption | null;
  timeline: TimelineOption | null;
  contact: ContactDetails;
  currentStep: number;
  estimate: EstimationResult | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submittedId: string | null;
  apiError: string | null;

  setObjective: (obj: BusinessObjective) => void;
  setRequirements: (req: DynamicRequirements | ((prev: DynamicRequirements) => DynamicRequirements)) => void;
  setBudget: (b: BudgetOption) => void;
  setTimeline: (t: TimelineOption) => void;
  setContact: (c: ContactDetails) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetWizard: () => void;
  submitInquiry: () => Promise<boolean>;
  downloadPdf: () => void;
  copySummaryToClipboard: () => Promise<boolean>;
}

const STORAGE_KEY = 'cynbit_project_discovery_state';

const initialContact: ContactDetails = {
  fullName: '',
  email: '',
  company: '',
  projectDescription: '',
};

const ProjectDiscoveryContext = createContext<ProjectDiscoveryContextType | undefined>(undefined);

export const ProjectDiscoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [objective, setObjectiveState] = useState<BusinessObjective | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.objective || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [requirements, setRequirementsState] = useState<DynamicRequirements>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.requirements || {};
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [budget, setBudgetState] = useState<BudgetOption | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.budget || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [timeline, setTimelineState] = useState<TimelineOption | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.timeline || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [contact, setContactState] = useState<ContactDetails>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.contact || initialContact;
      }
    } catch {
      // ignore
    }
    return initialContact;
  });

  const [currentStep, setCurrentStepState] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sync to sessionStorage to preserve answers across navigation
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          objective,
          requirements,
          budget,
          timeline,
          contact,
        }),
      );
    } catch {
      // ignore
    }
  }, [objective, requirements, budget, timeline, contact]);

  // Compute live estimate deterministically whenever inputs change
  const estimate = useMemo<EstimationResult | null>(() => {
    if (!objective) return null;
    return calculateProjectEstimate(objective, requirements, budget || undefined, timeline || undefined);
  }, [objective, requirements, budget, timeline]);

  const setObjective = (obj: BusinessObjective) => {
    setObjectiveState(obj);
  };

  const setRequirements = (
    req: DynamicRequirements | ((prev: DynamicRequirements) => DynamicRequirements),
  ) => {
    setRequirementsState(req);
  };

  const setBudget = (b: BudgetOption) => {
    setBudgetState(b);
  };

  const setTimeline = (t: TimelineOption) => {
    setTimelineState(t);
  };

  const setContact = (c: ContactDetails) => {
    setContactState(c);
  };

  const setCurrentStep = (step: number) => {
    setCurrentStepState(Math.min(Math.max(step, 1), 5));
  };

  const nextStep = () => {
    setCurrentStepState((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStepState((prev) => Math.max(prev - 1, 1));
  };

  const resetWizard = () => {
    setObjectiveState(null);
    setRequirementsState({});
    setBudgetState(null);
    setTimelineState(null);
    setContactState(initialContact);
    setCurrentStepState(1);
    setIsSubmitted(false);
    setSubmittedId(null);
    setApiError(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const submitInquiry = async (): Promise<boolean> => {
    if (!objective || !budget || !timeline || !contact.fullName || !contact.email) {
      setApiError('Please complete all questionnaire steps before submitting.');
      return false;
    }

    if (!estimate) return false;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      customerName: contact.fullName,
      name: contact.fullName,
      email: contact.email,
      company: contact.company || '',
      businessObjective: objective,
      goal: objective,
      projectType: estimate.recommendedService,
      solution: estimate.recommendedService,
      selectedRequirements: requirements,
      budget,
      timeline,
      projectDescription: contact.projectDescription,
      description: contact.projectDescription,
      recommendation: estimate.recommendedService,
      estimatedBudget: estimate.estimatedBudget,
      estimatedDuration: estimate.estimatedDuration,
    };

    const res = await submitProjectInquiry(payload);
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      const dataObj = res.data as { id?: string } | undefined;
      if (dataObj?.id) {
        setSubmittedId(dataObj.id);
      }
      return true;
    } else {
      setApiError(res.message || 'Failed to submit inquiry to server.');
      return false;
    }
  };

  const downloadPdf = () => {
    if (!objective || !budget || !timeline || !estimate) return;
    generateProjectBriefPdf({
      objective,
      requirements,
      budget,
      timeline,
      contact,
      estimate,
    });
  };

  const copySummaryToClipboard = async (): Promise<boolean> => {
    if (!objective || !estimate) return false;

    const summaryText = [
      `========================================`,
      `CYNBIT PROJECT DISCOVERY & COST ESTIMATE`,
      `========================================`,
      `Client Name: ${contact.fullName || 'Not provided'}`,
      `Company: ${contact.company || 'N/A'}`,
      `Email: ${contact.email || 'Not provided'}`,
      ``,
      `Business Objective: ${objective}`,
      `Recommended Service: ${estimate.recommendedService}`,
      `Project Complexity: ${estimate.projectComplexity}`,
      `Indicative Budget Range: ${estimate.estimatedBudget}`,
      `Estimated Timeline: ${estimate.estimatedDuration}`,
      `Stated Budget: ${budget || 'Not specified'}`,
      `Stated Timeline: ${timeline || 'Not specified'}`,
      ``,
      `Project Description:`,
      `${contact.projectDescription || 'No description provided.'}`,
      ``,
      `Recommended Next Steps:`,
      ...estimate.recommendedNextSteps.map((s, i) => `${i + 1}. ${s}`),
      ``,
      `* Disclaimer: Indicative estimate calculated by Cynbit Smart Discovery Engine. Not an official binding quotation.`,
      `========================================`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ProjectDiscoveryContext.Provider
      value={{
        objective,
        requirements,
        budget,
        timeline,
        contact,
        currentStep,
        estimate,
        isSubmitting,
        isSubmitted,
        submittedId,
        apiError,
        setObjective,
        setRequirements,
        setBudget,
        setTimeline,
        setContact,
        setCurrentStep,
        nextStep,
        prevStep,
        resetWizard,
        submitInquiry,
        downloadPdf,
        copySummaryToClipboard,
      }}
    >
      {children}
    </ProjectDiscoveryContext.Provider>
  );
};

export const useProjectDiscovery = (): ProjectDiscoveryContextType => {
  const ctx = useContext(ProjectDiscoveryContext);
  if (!ctx) {
    throw new Error('useProjectDiscovery must be used within a ProjectDiscoveryProvider');
  }
  return ctx;
};

