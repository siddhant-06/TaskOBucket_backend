import {
  bcryptComparePassword,
  bcryptPassword,
  generateJwtToken,
} from '../common/authHelper.js';
import * as DatabaseHelper from '../common/baseRepository.js';

export const login = async (data) => {
  try {
    const { email, password } = data;

    // Check if the user exists in the database
    const user = await DatabaseHelper.findRecords('user.model', { email });

    if (user.length === 0) {
      throw { statusCode: 404, message: 'User does not exist.' };
    }

    const hashedPassword = await bcryptPassword(password);

    // Checking if the provided password matches the hashed password stored in the database
    const isValidPassword = await bcryptComparePassword(
      user[0].password,
      hashedPassword
    );

    // If the password is incorrect, throw a 401 error
    if (!isValidPassword) {
      throw { statusCode: 401, message: 'Incorrect password.' };
    }

    // Generate a JWT token for the user on successful login
    const token = await generateJwtToken(user[0]);

    // Return the token and user details (role and name)
    return {
      token,
      role: user.role,
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
