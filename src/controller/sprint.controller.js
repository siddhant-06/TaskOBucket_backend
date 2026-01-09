// controller/sprint.controller.js
import * as SprintService from '../services/sprint.service.js';
import { constants } from '../common/constant.js';
import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';

const sprintConstant = constants.Sprint;

// controller to create sprint
export const createSprintController = async (req, res) => {
  try {
    const sprint = await SprintService.createSprintService(req.body, req.user);

    return sendSuccessResponse(res, sprintConstant.SPRINT_CREATED, sprint, 201);
  } catch (error) {
    return sendErrorResponse(res, error.statusCode || 500, error.message);
  }
};

// controller to update sprint
export const updateSprintController = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await SprintService.updateSprintService(
      id,
      req.body,
      req.user
    );

    return sendSuccessResponse(res, sprintConstant.SPRINT_UPDATED, sprint);
  } catch (error) {
    return sendErrorResponse(res, error.statusCode || 500, error.message);
  }
};

// controller to get by id sprint
export const getByIdSprintController = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await SprintService.getByIdSprintService(id, req.user);

    return sendSuccessResponse(res, sprintConstant.SPRINT_FETCHED, sprint);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || sprintConstant.SERVER_ERROR
    );
  }
};

// controller to list all in Kanban style  sprint with all filters
export const listSprintController = async (req, res) => {
  try {
    const { projectId, search = '', status, startDate, endDate } = req.query;

    const sprints = await SprintService.listSprintService(
      {
        projectId,
        search,
        status,
        startDate,
        endDate,
      },
      req.user
    );

    return sendSuccessResponse(
      res,
      sprintConstant.SPRINT_LIST_FETCHED,
      sprints
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || sprintConstant.SERVER_ERROR
    );
  }
};
