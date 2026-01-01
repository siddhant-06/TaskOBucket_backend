import { bcryptPassword } from '../common/authHelper.js';
import * as DatabaseHelper from '../common/baseRepository.js';

// createUserService function to create a new user in the database
export const createUserService = async (userData) => {
  try {
    const hashedPassword = await bcryptPassword(userData.password);
    return await DatabaseHelper.createRecord('user.model', {
      ...userData,
      password: hashedPassword,
    });
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error creating user',
    };
  }
};

// Method to get user details
export const getUserService = async ({ page, limit, filter }) => {
  try {
    return await DatabaseHelper.getRecords('user.model', filter, {
      page,
      limit,
    });
  } catch (error) {
    throw error;
  }
};

// Method to update user details
export const getByIdUserService = async ({ id }) => {
  try {
    return await DatabaseHelper.getRecordById('user.model', id);
  } catch (error) {
    throw error;
  }
};

// Method to update user details
export const updateUserService = async ({ id, userData }) => {
  try {
    return await DatabaseHelper.updateRecordById('user.model', id, userData);
  } catch (error) {
    throw error;
  }
};

// Method to delete a user
export const deleteUserService = async ({ id }) => {
  try {
    return await DatabaseHelper.deleteRecordById('user.model', id);
  } catch (error) {
    throw error;
  }
};
