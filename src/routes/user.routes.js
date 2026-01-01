import express from 'express';
import * as userController from '../controller/user.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import {
  createUserValidation,
  updateUserValidation,
} from '../validation/user.validation.js';
import userRoutesList from '../config/userRoutes.config.js';
import { authGaurd } from '../middleware/authGaurd.js';
const userRoutes = express.Router();

/*
 *  Register New User
 */
userRoutes.post(
  userRoutesList.create,
  payloadValidate(createUserValidation),
  userController.createUserController
);

userRoutes.get(
  userRoutesList.getAll,
  authGaurd,
  userController.getUserController
);

userRoutes.get(
  userRoutesList.getAll,
  authGaurd,
  userController.getUserController
);

userRoutes.get(
  userRoutesList.getById,
  authGaurd,
  userController.getByIdUserController
);

userRoutes.get(
  userRoutesList.update,
  authGaurd,
  payloadValidate(updateUserValidation),
  userController.upateUserController
);

userRoutes.get(
  userRoutesList.delete,
  authGaurd,
  userController.deleteUserController
);

export default userRoutes;
