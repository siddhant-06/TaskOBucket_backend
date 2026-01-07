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

export default projectRoutes;
