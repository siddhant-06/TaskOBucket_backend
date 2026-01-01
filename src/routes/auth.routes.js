import express from 'express';
import routeName from '../config/authRoutes.config.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import { createAuthValidation } from '../validation/auth.validation.js';
import * as authController from '../controller/auth.controller.js';

const authRoutes = express.Router();

authRoutes
  .route(routeName.create)
  .post(payloadValidate(createAuthValidation), authController.loginController);

export default authRoutes;
