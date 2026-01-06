import Joi from 'joi';

export const createUserValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  jobTitle: Joi.string().max(50).optional(),
  isActive: Joi.boolean().optional(),
  avatarUrl: Joi.string().uri().optional(),
});

export const getUsersValidation = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  search: Joi.string().min(1).optional(),
});

export const getUserByIdValidation = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const updateUserValidation = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  jobTitle: Joi.string().max(50).optional(),
  avatarUrl: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
}).min(1); // at least one field required

export const deleteUserValidation = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const deleteMultipleUsersValidation = Joi.object({
  ids: Joi.array().items(Joi.string().length(24).hex()).min(1).required(),
});
