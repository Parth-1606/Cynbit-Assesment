/**
 * Questionnaire content.
 *
 * The option `value` strings are intentionally identical to the labels used
 * by the backend's validation lists (backend/src/constants/questionnaire.ts)
 * so a selection can be persisted without any transformation.
 */
import {
  Bot,
  CalendarClock,
  Cloud,
  Code2,
  Compass,
  Gauge,
  HelpCircle,
  IndianRupee,
  Megaphone,
  Rocket,
  Settings2,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
  Zap,
} from 'lucide-react';
import type { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 'goal',
    step: 1,
    title: 'What is your primary business goal?',
    description: 'Pick the outcome that matters most right now. We weight this heavily.',
    icon: Target,
    options: [
      {
        value: 'Build a new digital product',
        label: 'Build a new digital product',
        hint: 'Launch something new from scratch',
        icon: Rocket,
      },
      {
        value: 'Automate business operations',
        label: 'Automate business operations',
        hint: 'Remove repetitive manual work',
        icon: Zap,
      },
      {
        value: 'Improve an existing website',
        label: 'Improve an existing website',
        hint: 'Fix, refactor or redesign what you have',
        icon: Wrench,
      },
      {
        value: 'Improve online presence',
        label: 'Improve online presence',
        hint: 'Get found and convert more visitors',
        icon: TrendingUp,
      },
      {
        value: 'Modernize existing infrastructure',
        label: 'Modernize existing infrastructure',
        hint: 'Migrate, scale or harden your stack',
        icon: Settings2,
      },
    ],
  },
  {
    id: 'solution',
    step: 2,
    title: 'What type of solution do you need?',
    description: 'Choose the closest match - "Not sure yet" is a perfectly good answer.',
    icon: Compass,
    options: [
      {
        value: 'Website / Web Application',
        label: 'Website / Web Application',
        hint: 'Marketing site, dashboard or SaaS product',
        icon: Code2,
      },
      {
        value: 'Mobile Application',
        label: 'Mobile Application',
        hint: 'iOS, Android or cross-platform',
        icon: Smartphone,
      },
      {
        value: 'AI Automation',
        label: 'AI Automation',
        hint: 'Agents, workflows and smart pipelines',
        icon: Bot,
      },
      {
        value: 'Cloud Infrastructure',
        label: 'Cloud Infrastructure',
        hint: 'Migration, DevOps and reliability',
        icon: Cloud,
      },
      {
        value: 'Digital Marketing',
        label: 'Digital Marketing',
        hint: 'SEO, paid ads and content growth',
        icon: Megaphone,
      },
      {
        value: 'Custom Software Development',
        label: 'Custom Software Development',
        hint: 'Bespoke internal tools and integrations',
        icon: Gauge,
      },
      {
        value: 'Not sure yet',
        label: 'Not sure yet',
        hint: 'Let the business goal drive the match',
        icon: HelpCircle,
      },
    ],
  },
  {
    id: 'budget',
    step: 3,
    title: 'What is your estimated budget?',
    description: 'This helps us recommend a scope that is realistic to deliver.',
    icon: IndianRupee,
    options: [
      { value: 'Below ₹25,000', label: 'Below ₹25,000', icon: IndianRupee },
      { value: '₹25,000–₹50,000', label: '₹25,000–₹50,000', icon: IndianRupee },
      { value: '₹50,000–₹1,00,000', label: '₹50,000–₹1,00,000', icon: IndianRupee },
      { value: '₹1,00,000–₹5,00,000', label: '₹1,00,000–₹5,00,000', icon: IndianRupee },
      { value: 'Above ₹5,00,000', label: 'Above ₹5,00,000', icon: IndianRupee },
      { value: 'Not decided', label: 'Not decided', hint: 'We will help you scope it', icon: HelpCircle },
    ],
  },
  {
    id: 'timeline',
    step: 4,
    title: 'What is your expected timeline?',
    description: 'Deadlines shape the delivery plan and the team we assemble.',
    icon: CalendarClock,
    options: [
      { value: 'Within 2 weeks', label: 'Within 2 weeks', hint: 'Urgent, focused delivery', icon: Zap },
      { value: 'Within 1 month', label: 'Within 1 month', hint: 'Fast turnaround', icon: CalendarClock },
      { value: '1–3 months', label: '1–3 months', hint: 'Standard project cadence', icon: CalendarClock },
      { value: '3–6 months', label: '3–6 months', hint: 'Phased, multi-team delivery', icon: CalendarClock },
      { value: 'Flexible', label: 'Flexible', hint: 'Quality over a fixed date', icon: Sparkles },
    ],
  },
];

/** Step 5 - contact form metadata. */
export const TOTAL_STEPS = 5;
