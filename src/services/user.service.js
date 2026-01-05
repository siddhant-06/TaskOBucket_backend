import * as constants from '../common/constant.js';
import * as DataBaseHelper from '../common/baseRepository.js';
import { bcryptPassword } from '../common/authHelper.js';

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
