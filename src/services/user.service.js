import * as DataBaseHelper from '../common/baseRepository.js';
import { bcryptPassword } from '../common/authHelper.js';

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
    return await DataBaseHelper.updateRecordById('user.model', id, updateData);
  } catch (error) {
    throw error;
  }
};

export const deleteUserService = async (id) => {
  try {
    return await DataBaseHelper.deleteRecordById('user.model', id);
  } catch (error) {
    throw error;
  }
};
export const deleteAllUsersService = async (filter) => {
  try {
    return await DataBaseHelper.deleteManyRecords('user.model', filter);
  } catch (error) {
    throw error;
  }
};
