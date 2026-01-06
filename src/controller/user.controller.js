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

    const options = {
      filter: search ? { name: { $regex: search, $options: 'i' } } : {},
    };

    if (limit && page) {
      options.limit = parseInt(limit, 10);
      options.page = parseInt(page, 10);
    }

    const users = await UserService.getAllUsersService(options);

    return sendSuccessResponse(res, userConstant.USER_LISTED, users, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || userConstant.SERVER_ERROR
    );
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🚀 ~ getUserByIdController ~ id:', id);

    if (!id) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }
    const user = await UserService.getUserByIdService(id);

    if (!user) {
      return sendErrorResponse(res, 404, userConstant.USER_NOT_FOUND);
    }

    console.log('🚀 ~ getUserByIdController ~ res:', res);
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
    console.log('🚀 ~ deleteUserController ~ id:', id);
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }

    const deletedUser = await UserService.deleteUserService(id);
    console.log('🚀 ~ deleteUserController ~ deletedUser:', deletedUser);

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
