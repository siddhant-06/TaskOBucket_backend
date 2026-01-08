import Joi from 'joi';

export const createProjectValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  project_key: Joi.string().min(2).max(10).required(),
  description: Joi.string().min(3).max(200).optional(),
});

export const getProjectByIdValidation = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const updateProjectValidation = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(200).optional(),
  startDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
