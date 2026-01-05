import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';
import * as AuthService from '../services/auth.service.js';

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.loginService({ email, password });

    if (user && user.token) {
      // If login is successful, send a success response with the token and user details
      return sendSuccessResponse(res, 'Login Successful', user, 200);
    }
    // If login fails, send an error response
    return sendErrorResponse(res, 401, 'Invalid email or password');
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || 'Internal Server Error'
    );
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    await AuthService.forgotPasswordService(email);
    return sendSuccessResponse(
      res,
      'Password reset link sent to email',
      {},
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || 'Internal Server Error'
    );
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPasswordService(token, newPassword);
    return sendSuccessResponse(res, 'Password reset successfully', {}, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || 'Internal Server Error'
    );
  }
};
