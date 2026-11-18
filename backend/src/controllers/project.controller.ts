/**
 * Project inquiry handlers for Cynbit Smart Discovery & Cost Estimator.
 */
import type { Request, Response, NextFunction } from 'express';
import { Project, type ProjectDocument } from '../models/Project';
import { getDatabaseState } from '../config/db';
import { EstimationService } from '../services/estimation.service';
import type { BusinessObjective, BudgetOption, TimelineOption } from '../constants/questionnaire';
import type { DynamicRequirements } from '../utils/estimationRules';

interface CreateProjectBody {
  customerName?: string;
  name?: string;
  email: string;
  company?: string;
  businessObjective?: BusinessObjective;
  goal?: BusinessObjective;
  projectType?: string;
  solution?: string;
  selectedRequirements?: DynamicRequirements;
  budget: BudgetOption;
  timeline: TimelineOption;
  projectDescription?: string;
  description?: string;
  recommendation?: string;
  estimatedBudget?: string;
  estimatedDuration?: string;
}

/** Guards writes when the database is unavailable so we return 503, not a timeout. */
function ensureDatabase(res: Response): boolean {
  if (getDatabaseState() !== 'connected') {
    res.status(503).json({
      success: false,
      message: 'Database unavailable. Please try again shortly.',
    });
    return false;
  }
  return true;
}

/** POST /api/projects - stores a new inquiry and returns the created record with verified estimates. */
export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!ensureDatabase(res)) return;

    const body = req.body as CreateProjectBody;
    const customerName = (body.customerName || body.name || '').trim();
    const email = body.email.trim().toLowerCase();
    const company = (body.company || '').trim();
    const businessObjective = (body.businessObjective || body.goal) as BusinessObjective;
    const selectedRequirements = body.selectedRequirements || {};
    const budget = body.budget;
    const timeline = body.timeline;
    const projectDescription = (body.projectDescription || body.description || '').trim();

    // Verify or calculate deterministic estimates on the server
    const serverEstimate = EstimationService.calculate(
      businessObjective,
      selectedRequirements,
      budget,
      timeline,
    );

    const recommendation = body.recommendation?.trim() || serverEstimate.recommendedService;
    const projectType = body.projectType?.trim() || body.solution?.trim() || serverEstimate.recommendedService;
    const estimatedBudget = body.estimatedBudget?.trim() || serverEstimate.estimatedBudget;
    const estimatedDuration = body.estimatedDuration?.trim() || serverEstimate.estimatedDuration;

    const project = await Project.create({
      customerName,
      name: customerName,
      email,
      company,
      businessObjective,
      goal: businessObjective,
      projectType,
      solution: projectType,
      selectedRequirements,
      budget,
      timeline,
      projectDescription,
      description: projectDescription,
      recommendation,
      estimatedBudget,
      estimatedDuration,
    });

    res.status(201).json({
      success: true,
      message: 'Project inquiry received successfully.',
      data: serialize(project),
      estimates: {
        recommendedService: serverEstimate.recommendedService,
        whyRecommended: serverEstimate.whyRecommended,
        projectComplexity: serverEstimate.projectComplexity,
        estimatedBudget: serverEstimate.estimatedBudget,
        estimatedDuration: serverEstimate.estimatedDuration,
        budgetConflictNote: serverEstimate.budgetConflictNote,
        recommendedNextSteps: serverEstimate.recommendedNextSteps,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/projects - lists inquiries, newest first.
 * Supports `?limit=` (1-100, default 50) for simple pagination.
 */
export async function listProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!ensureDatabase(res)) return;

    const requested = Number(req.query.limit);
    const limit = Number.isFinite(requested) ? Math.min(Math.max(Math.trunc(requested), 1), 100) : 50;

    const projects = (await Project.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()) as Array<Record<string, unknown>>;

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.map((project) => serializeLean(project)),
    });
  } catch (error) {
    next(error);
  }
}

// `InferSchemaType` omits `_id`, which Mongoose always adds to documents.
type PopulatedProject = ProjectDocument & { _id?: unknown };

function serialize(project: PopulatedProject): Record<string, unknown> {
  return {
    id: String(project._id),
    customerName: project.customerName || project.name,
    name: project.name || project.customerName,
    email: project.email,
    company: project.company,
    businessObjective: project.businessObjective || project.goal,
    goal: project.goal || project.businessObjective,
    projectType: project.projectType || project.solution,
    solution: project.solution || project.projectType,
    selectedRequirements: project.selectedRequirements,
    budget: project.budget,
    timeline: project.timeline,
    projectDescription: project.projectDescription || project.description,
    description: project.description || project.projectDescription,
    recommendation: project.recommendation,
    estimatedBudget: project.estimatedBudget,
    estimatedDuration: project.estimatedDuration,
    createdDate: project.createdDate || project.createdAt,
    createdAt: project.createdAt || project.createdDate,
  };
}

function serializeLean(raw: Record<string, unknown>): Record<string, unknown> {
  return {
    id: String(raw._id),
    customerName: raw.customerName || raw.name,
    name: raw.name || raw.customerName,
    email: raw.email,
    company: raw.company,
    businessObjective: raw.businessObjective || raw.goal,
    goal: raw.goal || raw.businessObjective,
    projectType: raw.projectType || raw.solution,
    solution: raw.solution || raw.projectType,
    selectedRequirements: raw.selectedRequirements,
    budget: raw.budget,
    timeline: raw.timeline,
    projectDescription: raw.projectDescription || raw.description,
    description: raw.description || raw.projectDescription,
    recommendation: raw.recommendation,
    estimatedBudget: raw.estimatedBudget,
    estimatedDuration: raw.estimatedDuration,
    createdDate: raw.createdDate || raw.createdAt,
    createdAt: raw.createdAt || raw.createdDate,
  };
}
