import Joi from 'joi';

export const createAuthValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});
export const resetPasswordValidation = Joi.object({
  token: Joi.string().hex().required(),
  newPassword: Joi.string().min(6).max(30).required(),
});
