import express from 'express';
import routeName from '../config/authRoutes.config.js';
import * as authController from '../controller/auth.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import { createAuthValidation } from '../validation/auth.validation.js';

const authRoutes = express.Router();

authRoutes
  .route(routeName.create)
  .post(payloadValidate(createAuthValidation), authController.loginController);

export default authRoutes;
