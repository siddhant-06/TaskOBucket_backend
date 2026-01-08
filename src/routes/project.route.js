import express from 'express';
import routeName from '../config/projectRoutes.config.js';
import * as projectController from '../controller/project.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import { createProjectValidation } from '../validation/project.validation.js';
import { authGuard } from '../middleware/authGuard.js';

const projectRoutes = express.Router();

// create project

projectRoutes.post(
  routeName.create,
  authGuard,
  payloadValidate(createProjectValidation),
  projectController.projectCreateController
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
