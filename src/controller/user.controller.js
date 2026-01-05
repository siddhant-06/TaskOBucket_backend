import { sendErrorResponse, sendSuccessResponse } from '../common/response.js';
import { constants } from '../common/constant.js';
import * as UserService from '../services/user.service.js';

// Controller to handle user creation
export const CreateUserController = async (req, res) => {
  try {
    const { name, email, password, jobTitle, isActive, avatarUrl } = req.body;

    const user = await UserService.createUserService({
      name,
      email,
      password,
      jobTitle,
      isActive,
      avatarUrl,
    });

    if (!user) {
      return sendErrorResponse(res, 400, constants.User.USER_NOT_CREATED);
    }

    const { passwordHash, ...safeUser } = user.toObject();
    return sendSuccessResponse(res, constants.User.USER_CREATED, safeUser, 201);
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};
