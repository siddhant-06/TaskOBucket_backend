import { constants } from '../common/constant.js';
import * as ProjectService from '../services/project.service.js';

const projectConstant = constants.Project;

// Controller to handle project creation
export const projectCreateController = (req, res) => {
  try {
    const { name, description, project_key } = req.body;
    const userId = req.user._id;

    const project = ProjectService.projectCreateService(
      {
        name,
        description,
        project_key,
      },
      userId
    );

    return sendSuccessResponse(
      res,
      projectConstant.PROJECT_CREATED,
      project,
      201
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || projectConstant.SERVER_ERROR
    );
  }
};

export const getProjectByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, projectConstant.PROJECT_ID_REQUIRED);
    }
    const project = await ProjectService.getProjectByIdService(id);

    if (!project) {
      return sendErrorResponse(res, 404, projectConstant.PROJECT_NOT_FOUND);
    }

    return sendSuccessResponse(
      res,
      projectConstant.PROJECT_FETCHED,
      project,
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode ? error.statusCode : 500,
      error.message ? error.message : error || projectConstant.SERVER_ERROR
    );
  }
};

// controller/project.controller.js
export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user._id;

    if (!id) {
      return sendErrorResponse(res, 400, projectConstant.PROJECT_ID_REQUIRED);
    }

    const project = await ProjectService.updateProjectService(
      id,
      updateData,
      userId
    );

    return sendSuccessResponse(
      res,
      projectConstant.PROJECT_UPDATED,
      project,
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || projectConstant.SERVER_ERROR
    );
  }
};

export const projectListController = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = '' } = req.query;
    const user = req.user;
    console.log(req);
    const projects = await ProjectService.projectListService({
      limit: Number(limit),
      page: Number(page),
      search,
      user,
    });

    return sendSuccessResponse(
      res,
      projectConstant.PROJECT_LIST_FETCHED,
      projects
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || projectConstant.SERVER_ERROR
    );
  }
};

export const projectDeleteController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return sendErrorResponse(res, 401, 'Unauthorized');
    }

    const project = await ProjectService.projectDeleteService(id, req.user);

    return sendSuccessResponse(res, projectConstant.PROJECT_DELETED, project);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || projectConstant.SERVER_ERROR
    );
  }
};

export const projectBulkDeleteController = async (req, res) => {
  try {
    const { projectIds } = req.body;

    if (!req.user) {
      return sendErrorResponse(res, 401, 'Unauthorized');
    }

    if (!Array.isArray(projectIds) || !projectIds.length) {
      return sendErrorResponse(
        res,
        400,
        'projectIds must be a non-empty array'
      );
    }

    const result = await ProjectService.projectBulkDeleteService(
      projectIds,
      req.user
    );

    return sendSuccessResponse(res, projectConstant.PROJECTS_DELETED, result);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || projectConstant.SERVER_ERROR
    );
  }
};

export const getProjectAssignableUsersController = async (req, res) => {
  try {
    const user = req.user;

    const users = await ProjectService.getProjectAssignableUsersService(user);

    return sendSuccessResponse(res, constants.User.USER_LISTED, users, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || constants.User.SERVER_ERROR
    );
  }
};
