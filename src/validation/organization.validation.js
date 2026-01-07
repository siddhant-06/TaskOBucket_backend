import Joi from 'joi';

export const createOrganizationValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  organization_key: Joi.string().min(2).max(10).required(),
});
