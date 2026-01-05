import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';
import * as AuthService from '../services/auth.service.js';

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.login({ email, password });

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
