import * as DatabaseHelper from '../common/baseRepository.js';
import {
  bcryptComparePassword,
  bcryptPassword,
  generateJwtToken,
} from '../common/authHelper.js';
import crypto from 'crypto';

export const loginService = async (data) => {
  try {
    const { email, password } = data;

    // Check if the user exists in the database
    const user = await DatabaseHelper.findRecords('user.model', { email });

    if (user.length === 0) {
      throw { statusCode: 404, message: 'User does not exist' };
    }

    const hashedPassword = await bcryptPassword(password);

    // Checking if the provided password matches the hashed password stored in the database
    const isValidPassword = await bcryptComparePassword(
      password,
      user[0].passwordHash
    );

    // If the password is incorrect, throw a 401 error
    if (!isValidPassword) {
      throw { statusCode: 401, message: 'incorrect password' };
    }

    // Generate a JWT token for the user on successful login
    const token = await generateJwtToken(user[0]);

    // Return the token and user details (role and name)
    return {
      token,
      //   role: user.role,
      name: user.name,
    };
  } catch (error) {
    console.log('Error in AuthService login method:', error);

    // Catch any errors, set appropriate status code and message, and return them
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error during login',
      details: error.details || null,
    };
  }
};

export const forgotPasswordService = async (email) => {
  try {
    // Implementation for forgot password functionality
    const user = await DatabaseHelper.findRecords('user.model', {
      email,
    });

    if (user.length === 0) {
      throw { statusCode: 404, message: 'User does not exist' };
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await DatabaseHelper.updateRecordById('user.model', user[0]._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 15 * 60 * 1000, // 15 mins
    });
    return { message: 'Password reset link has been sent to your email' };
  } catch (error) {}
};

export const resetPasswordService = async (token, newPassword) => {};
