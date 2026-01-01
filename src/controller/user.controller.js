import { sendErrorResponse, sendSuccessResponse } from '../common/response.js';
import * as UserService from '../services/user.service.js';
import { constants } from '../common/constant.js';
import mongoose from 'mongoose';
const objectId = mongoose.Types.ObjectId;
const userConstant = constants.User;

// Controller for creating a new user
export const createUserController = async (req, res) => {
  try {
    const { name, email, dob, password, phone, role } = req.body;

    const userCretedData = await UserService.createUserService({
      name,
      email,
      dob,
      password,
      phone,
      role,
    });
    // check if user not created
    if (!userCretedData) {
      return sendErrorResponse(res, 400, userConstant.USER_NOT_CREATED);
    }
    // return success response
    return sendSuccessResponse(
      res,
      userConstant.USER_CREATED,
      userCretedData,
      201
    );
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

export const getUserController = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const options = {
      filter: search ? { name: { $regex: search, $options: 'i' } } : {},
    };

    if (page && limit) {
      options.page = parseInt(page);
      options.limit = parseInt(limit);
    }

    const user = await UserService.getUserService(options);
    console.log('🚀 ~ getUserController ~ user:', user);

    return sendSuccessResponse(res, userConstant.USER_LISTED, user, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || userConstant.SERVER_ERROR
    );
  }
};

export const getByIdUserController = async (req, res) => {
  try {
    const { id } = req.query;

    // Validate if ID is provided
    if (!id) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }
    const user = await UserService.getByIdUserService({ id });
    if (!user) {
      return sendErrorResponse(res, 404, userConstant.USER_NOT_FOUND);
    }
    return sendSuccessResponse(res, userConstant.USER_FOUND, user, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || userConstant.SERVER_ERROR
    );
  }
};

export const upateUserController = async (req, res) => {
  try {
    const { id } = req.query;

    // Validate if ID is provided
    if (!objectId.isValid(id)) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }

    // Validate if request body contains data to update
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendErrorResponse(res, 400, userConstant.NO_DATA_PROVIDED);
    }

    const updatedUser = await UserService.updateUserService({
      id,
      userData: req.body,
    });

    // Check if the user was found and updated
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

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.query;

    // Validate if ID is provided
    if (!id) {
      return sendErrorResponse(res, 400, userConstant.USER_ID_REQUIRED);
    }

    const deletedUser = await UserService.deleteUserService({ id });

    // Check if the user was found and deleted
    if (!deletedUser) {
      return sendErrorResponse(res, 404, userConstant.USER_NOT_FOUND);
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
