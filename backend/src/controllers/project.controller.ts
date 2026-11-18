/**
 * Project inquiry handlers.
 */
import type { Request, Response, NextFunction } from 'express';
import { Project, type ProjectDocument } from '../models/Project';
import { getDatabaseState } from '../config/db';

/** Body shape after express-validator has run. */
interface CreateProjectBody {
  name: string;
  email: string;
  company?: string;
  goal: string;
  solution: string;
  budget: string;
  timeline: string;
  description: string;
  recommendation: string;
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

/** POST /api/projects - stores a new inquiry and returns the created record. */
export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!ensureDatabase(res)) return;

    const body = req.body as CreateProjectBody;

    const project = await Project.create({
      name: body.name,
      email: body.email,
      company: body.company?.trim() ?? '',
      goal: body.goal,
      solution: body.solution,
      budget: body.budget,
      timeline: body.timeline,
      description: body.description,
      recommendation: body.recommendation,
    });

    res.status(201).json({
      success: true,
      message: 'Project inquiry received successfully.',
      data: serialize(project),
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
    name: project.name,
    email: project.email,
    company: project.company,
    goal: project.goal,
    solution: project.solution,
    budget: project.budget,
    timeline: project.timeline,
    description: project.description,
    recommendation: project.recommendation,
    createdAt: project.createdAt,
  };
}

function serializeLean(project: Record<string, unknown>): Record<string, unknown> {
  const { _id, ...rest } = project;
  return { id: _id, ...rest };
}

// `lean()` returns plain objects, so the helper above accepts a loose shape.
