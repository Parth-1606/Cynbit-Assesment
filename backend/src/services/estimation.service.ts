/**
 * Service for calculating and verifying project discovery estimates on the backend.
 */

import {
  calculateProjectEstimate,
  type DynamicRequirements,
  type EstimationResult,
} from '../utils/estimationRules';
import type { BusinessObjective, BudgetOption, TimelineOption } from '../constants/questionnaire';

export class EstimationService {
  /**
   * Computes deterministic estimates given business objective, dynamic requirements,
   * budget preference, and timeline.
   */
  public static calculate(
    objective: BusinessObjective,
    requirements: DynamicRequirements = {},
    budget?: BudgetOption,
    timeline?: TimelineOption,
  ): EstimationResult {
    return calculateProjectEstimate(objective, requirements, budget, timeline);
  }
}

