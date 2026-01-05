import express from 'express';
import routeName from '../config/userRoutes.config.js';
import * as userController from '../controller/user.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import { createUserValidation } from '../validation/user.validation.js';

const userRoutes = express.Router();

userRoutes
  .route(routeName.create)
  .post(
    payloadValidate(createUserValidation),
    userController.CreateUserController
  );
export default userRoutes;
