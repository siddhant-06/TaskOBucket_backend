// validation middleware for validating request payloads using Joi
import { sendErrorResponse } from '../common/response.js';

export const payloadValidate = (schema, property = 'body') => {
  return (req, res, next) => {
    const data = req[property];

    if (!data || Object.keys(data).length === 0) {
      return sendErrorResponse(res, 400, `${property} payload is required`);
    }

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return sendErrorResponse(res, 400, errorMessages[0]);
    }

    next();
  };
};
