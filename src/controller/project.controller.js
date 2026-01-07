import * as ProjectService from '../services/project.service.js';
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
