/**
 * Professional PDF Project Brief Generator using jsPDF.
 */
import { jsPDF } from 'jspdf';
import type {
  BusinessObjective,
  BudgetOption,
  TimelineOption,
  DynamicRequirements,
  ContactDetails,
  EstimationResult,
} from '../types';

interface GeneratePdfOptions {
  objective: BusinessObjective;
  requirements: DynamicRequirements;
  budget: BudgetOption;
  timeline: TimelineOption;
  contact: ContactDetails;
  estimate: EstimationResult;
}

export function generateProjectBriefPdf(options: GeneratePdfOptions): void {
  const { objective, requirements, budget, timeline, contact, estimate } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner (Pine Teal #044e54)
  doc.setFillColor(4, 78, 84);
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Mint Accent Line
  doc.setFillColor(20, 184, 166);
  doc.rect(0, 36, pageWidth, 2, 'F');

  // Cynbit Logo / Brand Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CYNBIT TECHNOLOGIES', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('PROJECT DISCOVERY & COST ESTIMATION BRIEF', margin, 24);

  const docDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const refCode = `CYN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  doc.setFontSize(9);
  doc.text(`DATE: ${docDate}`, pageWidth - margin, 16, { align: 'right' });
  doc.text(`REF: ${refCode}`, pageWidth - margin, 24, { align: 'right' });

  let cursorY = 48;

  // Section 1: Client Information
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. CLIENT INFORMATION', margin, cursorY);

  cursorY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  doc.text(`Client Name: ${contact.fullName}`, margin, cursorY);
  doc.text(`Email: ${contact.email}`, margin + 90, cursorY);
  cursorY += 6;

  if (contact.company) {
    doc.text(`Company: ${contact.company}`, margin, cursorY);
    cursorY += 6;
  }
  cursorY += 4;

  // Section 2: Recommendation & Scope Overview
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. SERVICE RECOMMENDATION & COMPLEXITY', margin, cursorY);

  cursorY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 7;

  // Highlight Box for Recommended Service
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, cursorY - 1, contentWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(14, 116, 144); // Cyan 700
  doc.text(`Recommended Service: ${estimate.recommendedService}`, margin + 4, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Business Objective: ${objective}`, margin + 4, cursorY + 12);
  doc.text(`Project Complexity: ${estimate.projectComplexity}`, margin + 110, cursorY + 12);
  cursorY += 28;

  // Section 3: Financial & Timeline Estimates
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. INDICATIVE ESTIMATES & ALIGNMENT', margin, cursorY);

  cursorY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 6;

  // Grid box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, cursorY, contentWidth, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Indicative Budget: ${estimate.estimatedBudget}`, margin + 6, cursorY + 8);
  doc.text(`Estimated Timeline: ${estimate.estimatedDuration}`, margin + 105, cursorY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Client Budget Range: ${budget}`, margin + 6, cursorY + 16);
  doc.text(`Client Target Timeline: ${timeline}`, margin + 105, cursorY + 16);

  cursorY += 28;

  if (estimate.budgetConflictNote) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, cursorY, contentWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    const splitConflict = doc.splitTextToSize(estimate.budgetConflictNote, contentWidth - 8);
    doc.text(splitConflict, margin + 4, cursorY + 6);
    cursorY += 18;
  }

  // Section 4: Configured Requirements
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('4. CONFIGURED PROJECT REQUIREMENTS', margin, cursorY);

  cursorY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const reqLines: string[] = [];
  if (requirements.pages) reqLines.push(`• Scale: ${requirements.pages}`);
  if (requirements.authRequired) reqLines.push(`• Authentication Required: ${requirements.authRequired}`);
  if (requirements.paymentIntegration) reqLines.push(`• Payment Integration: ${requirements.paymentIntegration}`);
  if (requirements.adminDashboard) reqLines.push(`• Admin Dashboard: ${requirements.adminDashboard}`);
  if (requirements.userRoles) reqLines.push(`• User Roles: ${requirements.userRoles}`);
  if (requirements.dashboardRequirements) reqLines.push(`• Dashboard Level: ${requirements.dashboardRequirements}`);
  if (requirements.databaseRequirements) reqLines.push(`• Database Architecture: ${requirements.databaseRequirements}`);
  if (requirements.thirdPartyIntegrations && requirements.thirdPartyIntegrations.length > 0) {
    reqLines.push(`• Integrations: ${requirements.thirdPartyIntegrations.join(', ')}`);
  }
  if (requirements.platforms) reqLines.push(`• Target Platforms: ${requirements.platforms}`);
  if (requirements.aiChatbot) reqLines.push(`• AI Chatbot: Yes`);
  if (requirements.workflowAutomation) reqLines.push(`• Workflow Automation: Yes`);
  if (requirements.documentProcessing) reqLines.push(`• Document Processing: Yes`);
  if (requirements.customAiIntegration) reqLines.push(`• Custom AI Integration: Yes`);
  if (requirements.cloudMigration) reqLines.push(`• Cloud Migration: Yes`);
  if (requirements.deployment) reqLines.push(`• CI/CD & Deployment: Yes`);
  if (requirements.infrastructureOptimization) reqLines.push(`• Infrastructure Optimization: Yes`);
  if (requirements.scalabilityRequirements) reqLines.push(`• Scalability Architecture: Yes`);
  if (requirements.seo) reqLines.push(`• SEO Optimization: Yes`);
  if (requirements.socialMediaMarketing) reqLines.push(`• Social Media Marketing: Yes`);
  if (requirements.paidAdvertising) reqLines.push(`• Paid Advertising: Yes`);
  if (requirements.contentMarketing) reqLines.push(`• Content Marketing: Yes`);

  if (reqLines.length === 0) {
    reqLines.push('• Standard scope configured for the selected objective.');
  }

  for (const line of reqLines.slice(0, 7)) {
    doc.text(line, margin + 2, cursorY);
    cursorY += 5;
  }
  cursorY += 4;

  // Section 5: Project Description & Next Steps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('5. PROJECT DESCRIPTION & NEXT STEPS', margin, cursorY);

  cursorY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const descSplit = doc.splitTextToSize(`"${contact.projectDescription}"`, contentWidth);
  doc.text(descSplit.slice(0, 3), margin + 2, cursorY);
  cursorY += Math.min(descSplit.length, 3) * 4.5 + 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Recommended Next Steps with Cynbit:', margin + 2, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  for (const step of estimate.recommendedNextSteps) {
    doc.text(`1. ${step}`, margin + 4, cursorY);
    cursorY += 4.5;
  }

  // Footer Disclaimer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, margin + contentWidth, pageHeight - 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Notice: Indicative estimates calculated by Cynbit Smart Discovery Engine. Not an official binding quotation.',
    margin,
    pageHeight - 11,
  );
  doc.text('Cynbit Technologies — Confidential & Proprietary', pageWidth - margin, pageHeight - 11, {
    align: 'right',
  });

  // Save / Trigger Download
  const clientName = (contact.fullName || contact.name || 'Client').replace(/\s+/g, '_');
  const filename = `Cynbit_Project_Brief_${clientName}.pdf`;
  doc.save(filename);
}
