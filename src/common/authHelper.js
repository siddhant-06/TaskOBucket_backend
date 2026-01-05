import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );
  } catch (error) {
    throw new Error(error);
  }
};

//  Function to hash the user's password using bcrypt
export const bcryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(error);
  }
};

// Function to compare a plain text password with a hashed password
export const bcryptComparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error(error);
  }
};
