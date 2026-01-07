import express from 'express';
import routeName from '../config/userRoutes.config.js';
import * as userController from '../controller/user.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import {
  acceptInviteValidation,
  createUserValidation,
  deleteMultipleUsersValidation,
  deleteUserValidation,
  getUserByIdValidation,
  getUsersValidation,
  inviteUserValidation,
  updateUserValidation,
} from '../validation/user.validation.js';
import { authGuard } from '../middleware/authGuard.js';

const userRoutes = express.Router();

/** Create User (Public) */
userRoutes.post(
  routeName.create,
  payloadValidate(createUserValidation),
  userController.CreateUserController
);

/** Get all users */
userRoutes.get(
  routeName.getAll,
  authGuard,
  payloadValidate(getUsersValidation, 'query'),
  userController.GetAllUsersController
);

/** Get user by ID */
userRoutes.get(
  routeName.getById,
  authGuard,
  payloadValidate(getUserByIdValidation, 'params'),
  userController.getUserByIdController
);

/** Update user */
userRoutes.put(
  routeName.update,
  authGuard,
  payloadValidate(updateUserValidation),
  userController.updateUserController
);

/** Delete user by ID */
userRoutes.delete(
  routeName.delete,
  authGuard,
  payloadValidate(deleteUserValidation, 'params'),
  userController.deleteUserController
);

/** Delete multiple users */
userRoutes.put(
  routeName.deleteMany,
  authGuard,
  payloadValidate(deleteMultipleUsersValidation),
  userController.deleteAllUsersController
);

/** Invite  users */
userRoutes.post(
  routeName.invite,
  authGuard,
  payloadValidate(inviteUserValidation),
  userController.inviteUserController
);

/** Accept invite  users */
userRoutes.post(
  routeName.acceptInvite,
  payloadValidate(acceptInviteValidation),
  userController.acceptInviteController
);

export default userRoutes;
