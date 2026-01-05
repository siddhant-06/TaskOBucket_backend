import Joi from 'joi';

export const createUserValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  jobTitle: Joi.string().max(50).optional(),
  isActive: Joi.boolean().optional(),
  avatarUrl: Joi.string().uri().optional(),
});
