import { constants } from '../common/constant.js';
import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';
import * as AuthService from '../services/auth.service.js';

const authConstant = constants.Auth;
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.loginService({ email, password });

    if (user && user.token) {
      // If login is successful, send a success response with the token and user details
      return sendSuccessResponse(res, authConstant.LOGIN_SUCCESS, user, 200);
    }
    // If login fails, send an error response
    return sendErrorResponse(res, 401, authConstant.LOGIN_FAILED);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || authConstant.SERVER_ERROR
    );
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    await AuthService.forgotPasswordService(email);
    return sendSuccessResponse(
      res,
      authConstant.FORGOT_PASSWORD_SUCCESS,
      {},
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || authConstant.SERVER_ERROR
    );
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPasswordService(token, newPassword);
    return sendSuccessResponse(
      res,
      authConstant.RESET_PASSWORD_SUCCESS,
      {},
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || authConstant.SERVER_ERROR
    );
  }
};
