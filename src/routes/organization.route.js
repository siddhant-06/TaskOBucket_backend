import express from 'express';
import routeName from '../config/organization.config.js';
import * as organizationController from '../controller/organization.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import { createOrganizationValidation } from '../validation/organization.validation.js';
import { authGuard } from '../middleware/authGuard.js';

const organizationRoutes = express.Router();

/** Create Organization (Admin by default) */
organizationRoutes.post(
  routeName.create,
  authGuard,
  payloadValidate(createOrganizationValidation),
  organizationController.createOrganizationController
);

export default organizationRoutes;
