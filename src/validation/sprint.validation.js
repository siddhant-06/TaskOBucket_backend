import Joi from 'joi';

export const createSprintValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  projectId: Joi.string().length(24).hex().required(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  status: Joi.string()
    .valid('BACKLOG', 'SELECTED', 'IN_PROGRESS', 'DONE')
    .optional(),
});

export const updateSprintValidation = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  status: Joi.string()
    .valid('BACKLOG', 'SELECTED', 'IN_PROGRESS', 'DONE')
    .optional(),
  position: Joi.number().min(1).optional(),
}).min(1);

export const getByIdSprintValidation = Joi.object({
  id: Joi.string().length(24).hex().required(),
});
