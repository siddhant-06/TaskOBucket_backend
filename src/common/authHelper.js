import jwt from 'jsonwebtoken';
import brcypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

// Function to generate JWT token for a user with specific payload data
export const generateJwtToken = async (user) => {
  try {
    return jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        managedBy: user.managedBy,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );
  } catch (error) {
    throw new Error(error);
  }
};

// Function to hash the user's password using bcrypt
export const bcryptPassword = async (password) => {
  try {
    const salt = await brcypt.genSalt(10);
    return await brcypt.hash(password, salt);
  } catch (error) {
    throw new Error(error);
  }
};

// Function to compare a plain password with a stored hashed password
export const bcryptComparePassword = async (password, storedPassword) => {
  try {
    return await brcypt.compare(password, storedPassword);
  } catch (error) {
    throw new Error(error);
  }
};
