/**
 * Route definitions for project inquiries.
 */
import { Router } from 'express';
import { validationResult } from 'express-validator';
import { createProject, listProjects } from '../controllers/project.controller';
import { requireAdmin } from '../middleware/auth';
import { createProjectRules } from '../validation/project.validation';

const router = Router();

/** Turns express-validator failures into a structured 400 response. */
function handleValidation(req: Parameters<typeof createProject>[0], res: Parameters<typeof createProject>[1], next: Parameters<typeof createProject>[2]): void {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }
  res.status(400).json({
    success: false,
    message: 'Validation failed.',
    errors: errors.array().map((error) => ({
      // `errors.array()` is a union; only field-level errors carry `path`.
      field: 'path' in error ? error.path : 'unknown',
      message: 'msg' in error ? error.msg : 'Invalid value',
    })),
  });
}

router.post('/', createProjectRules, handleValidation, createProject);
router.get('/', requireAdmin, listProjects);

export default router;
