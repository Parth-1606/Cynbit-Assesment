/**
 * Cynbit service catalogue.
 * Single source of truth for service metadata used by the UI and the
 * recommendation engine.
 */
import { Bot, Cloud, Code2, Megaphone, Smartphone, Wrench } from 'lucide-react';
import type { Service, ServiceId } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'full-stack',
    name: 'Full Stack Development',
    tagline: 'Web apps built end to end',
    description:
      'Production-grade websites, dashboards and SaaS products covering UI, APIs, databases and deployment.',
    icon: Code2,
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Development',
    tagline: 'iOS, Android and cross-platform',
    description:
      'Native and cross-platform mobile applications with polished UX, offline support and app-store delivery.',
    icon: Smartphone,
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    tagline: 'Agents, workflows and pipelines',
    description:
      'LLM-powered agents, document processing and business-process automation that remove repetitive manual work.',
    icon: Bot,
  },
  {
    id: 'cloud-solutions',
    name: 'Cloud Solutions',
    tagline: 'Migration, DevOps and reliability',
    description:
      'Cloud migration, infrastructure-as-code, CI/CD, observability and cost optimisation for modern stacks.',
    icon: Cloud,
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    tagline: 'SEO, paid media and content',
    description:
      'Technical SEO, performance marketing, analytics and content strategy that grow qualified traffic and leads.',
    icon: Megaphone,
  },
  {
    id: 'custom-software',
    name: 'Custom Software Development',
    tagline: 'Bespoke tools and integrations',
    description:
      'Internal tools, workflow systems and third-party integrations tailored exactly to how your business runs.',
    icon: Wrench,
  },
];

/** Looks up a service by id, falling back to Full Stack Development. */
export function getService(id: ServiceId): Service {
  return SERVICES.find((service) => service.id === id) ?? SERVICES[0];
}
