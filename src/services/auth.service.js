import * as DatabaseHelper from '../common/baseRepository.js';
import {
  bcryptComparePassword,
  bcryptPassword,
  generateJwtToken,
} from '../common/authHelper.js';
import crypto from 'crypto';
import { sendEmail } from '../common/nodemailer.js';

export const loginService = async (data) => {
  try {
    const { email, password } = data;

    // Check if the user exists in the database
    const user = await DatabaseHelper.findRecords('user.model', { email });

    if (user.length === 0) {
      throw { statusCode: 404, message: authConstant.USER_NOT_FOUND };
    }

    const hashedPassword = await bcryptPassword(password);

    // Checking if the provided password matches the hashed password stored in the database
    const isValidPassword = await bcryptComparePassword(
      password,
      user[0].passwordHash
    );

    // If the password is incorrect, throw a 401 error
    if (!isValidPassword) {
      throw { statusCode: 401, message: authConstant.PASSWORD_INCORRECT };
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
    // Catch any errors, set appropriate status code and message, and return them
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || authConstant.SERVER_ERROR,
    };
  }
};

export const forgotPasswordService = async (email) => {
  try {
    // Normalize email
    const users = await DatabaseHelper.findRecords('user.model', {
      email,
    });

    //  Do NOT reveal if user exists
    if (!users.length) return;

    const user = users[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token before saving
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save hashed token & expiry
    await DatabaseHelper.updateRecordById('user.model', user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    await sendEmail({
      to: user.email,
      subject: 'Reset your TaskOBucket password',
      html: `
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetLink}">Click here to reset your password</a>
      </p>
      <p>This link will expire in 15 minutes.</p>
    `,
    });
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || authConstant.SERVER_ERROR,
      details: error.details || null,
    };
  }
};

export const resetPasswordService = async (token, newPassword) => {
  try {
    // Hash token before saving
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid user with unexpired token
    const users = await DatabaseHelper.findRecords('user.model', {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (users.length === 0) {
      throw { statusCode: 400, message: authConstant.RESET_TOKEN_INVALID };
    }

    const user = users[0];

    // const isSamePassword = await bcryptComparePassword(
    //   newPassword,
    //   user.passwordHash
    // );
    // if (isSamePassword) {
    //   throw { statusCode: 400, message: 'New password must be different' };
    // }

    // Hash new password
    const hashedPassword = await bcryptPassword(newPassword);

    // Update user's password and clear reset token fields
    await DatabaseHelper.updateRecordById('user.model', user._id, {
      passwordHash: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || authConstant.SERVER_ERROR,
      details: error.details || null,
    };
  }
};
