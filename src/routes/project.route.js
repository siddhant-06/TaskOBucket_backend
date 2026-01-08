import express from 'express';
import routeName from '../config/projectRoutes.config.js';
import * as projectController from '../controller/project.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import {
  createProjectValidation,
  getProjectByIdValidation,
  updateProjectValidation,
} from '../validation/project.validation.js';
import { authGuard } from '../middleware/authGuard.js';

const projectRoutes = express.Router();

// create project
projectRoutes.post(
  routeName.create,
  authGuard,
  payloadValidate(createProjectValidation),
  projectController.projectCreateController
);

/** Get project by ID */
projectRoutes.get(
  routeName.getById,
  authGuard,
  payloadValidate(getProjectByIdValidation, 'params'),
  projectController.getProjectByIdController
);

// routes/project.route.js
projectRoutes.put(
  routeName.update,
  authGuard,
  payloadValidate(updateProjectValidation),
  projectController.updateProjectController
);
// list projects
projectRoutes.get(
  routeName.list,
  authGuard,
  projectController.projectListController
);

// delete single project
projectRoutes.delete(
  routeName.delete,
  authGuard,
  projectController.projectDeleteController
);

// delete multiple projects
projectRoutes.delete(
  routeName.bulkDelete,
  authGuard,
  projectController.projectBulkDeleteController
);

export default projectRoutes;
