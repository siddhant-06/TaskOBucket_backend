import Joi from 'joi';

export const createProjectValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  project_key: Joi.string().min(2).max(10).required(),
  description: Joi.string().min(3).max(100).optional(),
});
