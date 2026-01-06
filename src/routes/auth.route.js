import express from 'express';
import routeName from '../config/authRoutes.config.js';
import * as authController from '../controller/auth.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import {
  createAuthValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../validation/auth.validation.js';

const authRoutes = express.Router();

authRoutes
  .route(routeName.create)
  .post(payloadValidate(createAuthValidation), authController.loginController);

authRoutes
  .route(routeName.forgotPassword)
  .post(
    payloadValidate(forgotPasswordValidation),
    authController.forgotPasswordController
  );

authRoutes
  .route(routeName.resetPassword)
  .put(
    payloadValidate(resetPasswordValidation),
    authController.resetPasswordController
  );

export default authRoutes;
