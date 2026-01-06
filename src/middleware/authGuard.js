import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as DatabaseHelper from '../common/baseRepository.js';
import { sendErrorResponse } from '../common/response.js';

// configure dotenv
dotenv.config();

export const authGuard = async (req, res, next) => {
  try {
    // Extract Token from Authorization Header
    const accessToken = req.headers['authorization'];
    const token = accessToken?.split('Bearer ')[1];
    // Check if Token Exists
    if (!token) {
      return sendErrorResponse(res, 401, 'token does not Exist!!');
    }

    // Verify the JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if User Exists in Database
    const isUserExist = await DatabaseHelper.getRecordByIdFilter(
      'user.model',
      decoded._id
    );

    if (!isUserExist) {
      return sendErrorResponse(
        res,
        401,
        'Unauthorized Request. User does not exist.'
      );
    }
    // Attach User to Request Object
    req.user = isUserExist;
    next();
  } catch (err) {
    // Error Handling
    if (err.name === 'JsonWebTokenError') {
      return sendErrorResponse(
        res,
        err.statusCode ?? 401,
        'Unauthorized Request. Invalid token.'
      );
    } else if (err.name === 'TokenExpiredError') {
      return sendErrorResponse(
        res,
        err.statusCode ?? 401,
        'Unauthorized Request. Token expired.'
      );
    }
    // General Error Handling
    return sendErrorResponse(
      res,
      err?.statusCode ?? 500,
      'Internal Server Error.'
    );
  }
};
