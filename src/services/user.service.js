import * as DataBaseHelper from '../common/baseRepository.js';
import { bcryptPassword } from '../common/authHelper.js';
import crypto from 'crypto';
import { sendEmail } from '../common/nodemailer.js';
import { constants } from '../common/constant.js';

const userConstant = constants.User;
// Service to create a new user
export const createUserService = async (userData) => {
  try {
    const hashedPassword = await bcryptPassword(userData.password);

    const existingUser = await DataBaseHelper.findRecords('user.model', {
      email: userData.email,
    });
    if (existingUser.length) {
      throw { statusCode: 409, message: 'Email already exists' };
    }
    return await DataBaseHelper.createRecord('user.model', {
      name: userData.name,
      email: userData.email,
      passwordHash: hashedPassword,
      jobTitle: userData.jobTitle,
      isActive: userData.isActive,
      avatarUrl: userData.avatarUrl,
    });
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error creating user',
    };
  }
};

// Service to get all users with optional filtering and pagination
export const getAllUsersService = async (options) => {
  try {
    const { filter = {}, limit, page } = options;
    const queryOptions = {};
    if (limit && page) {
      queryOptions.page = page;
      queryOptions.limit = limit;
    }
    return await DataBaseHelper.getAllRecords(
      'user.model',
      filter,
      queryOptions
    );
  } catch (error) {
    throw error;
  }
};

// Service to get a user by ID
export const getUserByIdService = async (id) => {
  try {
    return await DataBaseHelper.getRecordById('user.model', id);
  } catch (error) {
    throw error;
  }
};

// Service to update a user by ID
export const updateUserService = async (id, updateData) => {
  try {
    // Fetch existing user
    delete updateData.setupStep;

    const user = await DataBaseHelper.getRecordById('user.model', id);

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    /**
     * STEP-2 LOGIC
     * If admin is completing profile for the first time
     */
    if (user.isOrgAdmin && user.setupStep === 1) {
      updateData.setupStep = 2;
    }

    return await DataBaseHelper.updateRecordById('user.model', id, updateData);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update user',
    };
  }
};

// service to delete user by id
export const deleteUserService = async (id) => {
  try {
    return await DataBaseHelper.deleteRecordById('user.model', id);
  } catch (error) {
    throw error;
  }
};

// service to delete all users
export const deleteAllUsersService = async (filter) => {
  try {
    return await DataBaseHelper.deleteManyRecords('user.model', filter);
  } catch (error) {
    throw error;
  }
};

// service to invite user via email
export const inviteUserService = async ({ email, name }, adminUser) => {
  try {
    /**  Admin check */
    if (!adminUser.isOrgAdmin && !adminUser.organizationId) {
      throw {
        statusCode: 403,
        message: userConstant.ONLY_ADMIN_CAN_INVITE,
      };
    }

    /**  Check if user already exists */
    let users = await DataBaseHelper.findRecords('user.model', { email });
    let user = users[0];

    /**  Create user if not exists */
    if (!user) {
      user = await DataBaseHelper.createRecord('user.model', {
        name,
        email,
        organizationId: adminUser.organizationId,
        isActive: false,
        isInvited: true,
      });
    } else {
      // If user already exists but belongs to another org
      if (
        user.organizationId !== null &&
        adminUser.organizationId !== null &&
        user.organizationId.toString() !== adminUser.organizationId.toString()
      ) {
        throw {
          statusCode: 400,
          message: userConstant.USER_ALREADY_IN_ORG,
        };
      }
    }

    // Prevent re-inviting active invite
    if (
      user.isInvited &&
      user.inviteTokenExpires &&
      user.inviteTokenExpires > Date.now()
    ) {
      throw {
        statusCode: 400,
        message: userConstant.USER_ALREADY_INVITED,
      };
    }

    /**  Generate invite token */
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const hashedInviteToken = crypto
      .createHash('sha256')
      .update(inviteToken)
      .digest('hex');

    /**  Save token */
    await DataBaseHelper.updateRecordById('user.model', user._id, {
      inviteToken: hashedInviteToken,
      inviteTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    /**  Send invite email */
    const inviteLink = `${process.env.FRONTEND_URL_INVITE}/?token=${inviteToken}`;

    await sendEmail({
      to: email,
      subject: 'You are invited to join TaskOBucket',
      html: `
        <p>Hello ${name || 'User'},</p>
        <p>You have been invited to join an organization on <b>TaskOBucket</b>.</p>
        <p>
          <a href="${inviteLink}">Click here to accept the invitation</a>
        </p>
        <p>This invitation will expire in 24 hours.</p>
      `,
    });

    return true;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || userConstant.USER_INVITE_FAILED,
    };
  }
};

export const acceptInviteService = async (token, password) => {
  try {
    /**  Hash incoming token */
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    /**  Find valid invited user */
    const users = await DataBaseHelper.findRecords('user.model', {
      inviteToken: hashedToken,
      inviteTokenExpires: { $gt: Date.now() },
      isInvited: true,
    });

    if (!users.length) {
      throw {
        statusCode: 400,
        message: userConstant.INVALID_INVITE_TOKEN,
      };
    }

    const user = users[0];

    /**  Hash password */
    const hashedPassword = await bcryptPassword(password);

    /**  Activate user & clear invite fields */
    await DataBaseHelper.updateRecordById('user.model', user._id, {
      passwordHash: hashedPassword,
      isActive: true,
      isInvited: false,
      inviteToken: null,
      inviteTokenExpires: null,
    });

    /**  (Optional) Auto-login after accept invite */
    // const jwtToken = await generateJwtToken(user);

    return {
      // token: jwtToken,
      name: user.name,
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || userConstant.ACCEPT_INVITE_FAILED,
    };
  }
};
