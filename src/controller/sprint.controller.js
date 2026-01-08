// controller/sprint.controller.js
import * as SprintService from '../services/sprint.service.js';
import { constants } from '../common/constant.js';
import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';

const sprintConstant = constants.Sprint;

// export const createSprintController = async (req, res) => {
//   try {
//     const sprint = await SprintService.createSprintService(
//       req.body,
//       req.user._id
//     );

//     return sendSuccessResponse(res, sprintConstant.SPRINT_CREATED, sprint, 201);
//   } catch (error) {
//     return sendErrorResponse(
//       res,
//       error.statusCode || 500,
//       error.message || sprintConstant.SERVER_ERROR
//     );
//   }
// };

export const createSprintController = async (req, res) => {
  try {
    const sprint = await SprintService.createSprintService(req.body, req.user);

    return sendSuccessResponse(
      res,
      constants.Sprint.SPRINT_CREATED,
      sprint,
      201
    );
  } catch (error) {
    return sendErrorResponse(res, error.statusCode || 500, error.message);
  }
};

export const updateSprintController = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await SprintService.updateSprintService(
      id,
      req.body,
      req.user
    );

    return sendSuccessResponse(res, constants.Sprint.SPRINT_UPDATED, sprint);
  } catch (error) {
    return sendErrorResponse(res, error.statusCode || 500, error.message);
  }
};
