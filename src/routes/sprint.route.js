// routes/sprint.route.js
import express from 'express';
import { authGuard } from '../middleware/authGuard.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import {
  createSprintValidation,
  updateSprintValidation,
} from '../validation/sprint.validation.js';
import * as sprintController from '../controller/sprint.controller.js';
import sprintRoutesList from '../config/sprintRoutes.config.js';

const sprintRoutes = express.Router();

// create sprint
sprintRoutes.post(
  sprintRoutesList.create,
  authGuard,
  payloadValidate(createSprintValidation),
  sprintController.createSprintController
);

// get sprint by id
sprintRoutes.get(
  sprintRoutesList.getById,
  authGuard,
  sprintController.getByIdSprintController
);

// update sprint - with Kanban dashBoard
sprintRoutes.put(
  sprintRoutesList.update,
  authGuard,
  payloadValidate(updateSprintValidation),
  sprintController.updateSprintController
);

// list all sprints with filters
sprintRoutes.get(
  sprintRoutesList.list,
  authGuard,
  sprintController.listSprintController
);

export default sprintRoutes;
