import Joi from 'joi';

// Validation schema for user creation
export const createUserValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid('admin', 'user', 'suplier').default('user'),
  phone: Joi.string().required(),
  dob: Joi.date().iso().required(),
});

export const updateUserValidation = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(30),
  role: Joi.string().valid('admin', 'user', 'suplier').default('user'),
  phone: Joi.string(),
  dob: Joi.date().iso(),
});
