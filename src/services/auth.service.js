import * as DatabaseHelper from '../common/baseRepository.js';
import {
  bcryptComparePassword,
  bcryptPassword,
  generateJwtToken,
} from '../common/authHelper.js';
import crypto from 'crypto';
import { sendEmail } from '../common/nodemailer.js';
import { constants } from '../common/constant.js';

const authConstant = constants.Auth;
export const loginService = async ({ email, password }) => {
  // Find user
  const users = await DatabaseHelper.findRecords('user.model', { email });

  //  FIRST-TIME ADMIN LOGIN (BOOTSTRAP)
  if (!users.length) {
    const hashedPassword = await bcryptPassword(password);

    const newUser = await DatabaseHelper.createRecord('user.model', {
      email,
      passwordHash: hashedPassword,
      isActive: true,
      isOrgAdmin: true,
    });

    const token = await generateJwtToken(newUser);

    return {
      token,
      name: newUser.name || '',
      requiresSetup: true,
      id: newUser._id,
    };
  }

  const user = users[0];

  //  User exists but not activated (invite not accepted)
  if (!user.isActive || !user.passwordHash) {
    throw {
      statusCode: 403,
      message: authConstant.USER_NOT_ACTIVATED,
    };
  }

  // Validate password
  const isValidPassword = await bcryptComparePassword(
    password,
    user.passwordHash
  );

  if (!isValidPassword) {
    throw {
      statusCode: 401,
      message: authConstant.PASSWORD_INCORRECT,
    };
  }

  const token = await generateJwtToken(user);

  return {
    token,
    name: user.name,
  };
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
    const resetLink = `${process.env.FRONTEND_URL}?token=${resetToken}`;

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
