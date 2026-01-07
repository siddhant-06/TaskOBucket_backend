import { sendErrorResponse, sendSuccessResponse } from '../common/response.js';
import { constants } from '../common/constant.js';
import * as UserService from '../services/user.service.js';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;
const userConstant = constants.User;
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
      return sendErrorResponse(res, 400, userConstant.USER_NOT_CREATED);
    }

    const { passwordHash, ...safeUser } = user.toObject();
    return sendSuccessResponse(res, userConstant.USER_CREATED, safeUser, 201);
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Controller to get all users
export const GetAllUsersController = async (req, res) => {
  try {
    const { limit, page, search } = req.query;

    const loggedInUser = req.user;

    //  Base filter: same organization only
    const filter = {
      organizationId: loggedInUser.organizationId,
    };

    // 🔍 Search
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    //  Role-based restriction
    if (!loggedInUser.isOrgAdmin) {
      // Non-admin can see only themselves
      filter._id = loggedInUser._id;
    }

    const options = { filter };

    if (limit && page) {
      options.limit = parseInt(limit, 10);
      options.page = parseInt(page, 10);
    }

    const users = await UserService.getAllUsersService(options);

    return sendSuccessResponse(res, userConstant.USER_LISTED, users, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || userConstant.SERVER_ERROR
    );
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }
    const user = await UserService.getUserByIdService(id);

    if (!user) {
      return sendErrorResponse(res, 404, userConstant.USER_NOT_FOUND);
    }

    return sendSuccessResponse(res, userConstant.USER_FETCHED, user, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || userConstant.SERVER_ERROR
    );
  }
};

// Controller to update a user
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return sendErrorResponse(res, 400, userConstant.NO_DATA_PROVIDED);
    }
    // Call the service to update the user
    const updatedUser = await UserService.updateUserService(id, updateData);

    if (!updatedUser) {
      return sendErrorResponse(res, 404, userConstant.USER_NOT_FOUND);
    }
    return sendSuccessResponse(
      res,
      userConstant.USER_UPDATED,
      updatedUser,
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || userConstant.SERVER_ERROR
    );
  }
};

// Controller to delete a user
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }

    const deletedUser = await UserService.deleteUserService(id);

    if (!deletedUser) {
      sendErrorResponse(res, 404, userConstant.USER_NOT_FOUND);
    }

    return sendSuccessResponse(
      res,
      userConstant.USER_DELETED,
      deletedUser,
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || userConstant.SERVER_ERROR
    );
  }
};

//Controller to delete all users
export const deleteAllUsersController = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids) {
      sendErrorResponse(res, 404, userConstant.USER_ID_REQUIRED);
    }

    if (!Array.isArray(ids) || !ids.length) {
      sendErrorResponse(res, 400, userConstant.USER_ID_ARRAY_REQUIRED);
    }

    const filter = { _id: { $in: ids } };
    const deletedUsers = await UserService.deleteAllUsersService(filter);

    if (!deletedUsers) {
      sendErrorResponse(res, 404, userConstant.USER_NOT_FOUND);
    }

    return sendSuccessResponse(
      res,
      userConstant.USER_DELETED,
      deletedUsers,
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || userConstant.SERVER_ERROR
    );
  }
};

//Controller to  invite user via email
export const inviteUserController = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Logged-in admin (from authGuard)
    const adminUser = req.user;

    await UserService.inviteUserService({ email, name }, adminUser);

    return sendSuccessResponse(res, userConstant.USER_INVITE_SENT, {}, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || userConstant.SERVER_ERROR
    );
  }
};

// Controller to accept user invite
export const acceptInviteController = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return sendErrorResponse(res, 400, userConstant.PASSWORD_MISMATCH);
    }

    await UserService.acceptInviteService(token, password);

    return sendSuccessResponse(res, userConstant.INVITE_ACCEPTED, {}, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || userConstant.SERVER_ERROR
    );
  }
};
