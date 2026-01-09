// services/sprint.service.js
import * as DataBaseHelper from '../common/baseRepository.js';
import { constants } from '../common/constant.js';

const sprintConstant = constants.Sprint;
const projectConstant = constants.Project;

// service to create sprint
export const createSprintService = async (data, user) => {
  try {
    if (!user.organizationId) {
      throw { statusCode: 400, message: sprintConstant.USER_NO_ORG };
    }

    // Only admin can create sprint (as per current rules)
    if (!user.isOrgAdmin) {
      throw { statusCode: 403, message: sprintConstant.ONLY_ADMIN };
    }

    // Project validation
    const project = await DataBaseHelper.getRecordById(
      'project.model',
      data.projectId
    );

    if (!project) {
      throw {
        statusCode: 404,
        message: projectConstant.PROJECT_NOT_FOUND,
      };
    }

    // Org check
    if (project.organizationId.toString() !== user.organizationId.toString()) {
      throw {
        statusCode: 403,
        message: sprintConstant.UNAUTHORIZED_PROJECT_ACCESS,
      };
    }

    // Date validation
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) >= new Date(data.endDate)
    ) {
      throw {
        statusCode: 400,
        message: sprintConstant.INVALID_DATE_RANGE,
      };
    }

    // Find last position in column
    const lastSprint = await DataBaseHelper.findRecords(
      'sprint.model',
      {
        projectId: data.projectId,
        status: data.status || 'BACKLOG',
      },
      { sort: { position: -1 }, limit: 1 }
    );

    const nextPosition = lastSprint.length ? lastSprint[0].position + 1 : 1;

    return await DataBaseHelper.createRecord('sprint.model', {
      name: data.name,
      projectId: data.projectId,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || 'BACKLOG',
      position: nextPosition,
    });
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || sprintConstant.SPRINT_NOT_CREATED,
    };
  }
};

// service to update sprint
export const updateSprintService = async (sprintId, updateData, user) => {
  try {
    const sprint = await DataBaseHelper.getRecordById('sprint.model', sprintId);

    if (!sprint) {
      throw { statusCode: 404, message: 'Sprint not found' };
    }

    // Permission
    if (!user.isOrgAdmin) {
      throw {
        statusCode: 403,
        message: 'Only admin can update sprint',
      };
    }

    // If status or position changed → reorder
    if (updateData.status || typeof updateData.position === 'number') {
      const newStatus = updateData.status || sprint.status;

      let newPosition = updateData.position;

      // If moved to another column and position not provided
      if (updateData.status && typeof updateData.position !== 'number') {
        const lastSprint = await DataBaseHelper.findRecords(
          'sprint.model',
          { projectId: sprint.projectId, status: newStatus },
          { sort: { position: -1 }, limit: 1 }
        );

        newPosition = lastSprint.length ? lastSprint[0].position + 1 : 1;
      }

      await DataBaseHelper.updateManyRecords(
        'sprint.model',
        {
          projectId: sprint.projectId,
          status: newStatus,
          position: { $gte: newPosition },
          _id: { $ne: sprintId },
        },
        { $inc: { position: 1 } }
      );

      sprint.status = newStatus;
      sprint.position = newPosition;
    }

    Object.assign(sprint, updateData);
    await sprint.save();

    return sprint;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Sprint update failed',
    };
  }
};

// service to get by id sprint
export const getByIdSprintService = async (sprintId, user) => {
  try {
    // project check
    const sprint = await DataBaseHelper.getRecordById('sprint.model', sprintId);

    if (!sprint) {
      throw { statusCode: 404, message: sprintConstant.SPRINT_NOT_FOUND };
    }

    // project check
    const project = await DataBaseHelper.getRecordById(
      'project.model',
      sprint.projectId
    );

    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    // organization check
    if (project.organizationId.toString() !== user.organizationId.toString()) {
      throw {
        statusCode: 403,
        message: sprintConstant.UNAUTHORIZED_PROJECT_ACCESS,
      };
    }

    return sprint;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || sprintConstant.SERVER_ERROR,
    };
  }
};

// service to list all  sprint with filters
export const listSprintService = async (filters, user) => {
  try {
    const { projectId, search = '', status, startDate, endDate } = filters;

    if (!projectId) {
      throw { statusCode: 400, message: sprintConstant.PROJECT_ID_REQUIRED };
    }

    const project = await DataBaseHelper.getRecordById(
      'project.model',
      projectId
    );

    if (!project) {
      throw { statusCode: 404, message: projectConstant.PROJECT_NOT_FOUND };
    }

    if (project.organizationId.toString() !== user.organizationId.toString()) {
      throw {
        statusCode: 403,
        message: sprintConstant.UNAUTHORIZED_PROJECT_ACCESS,
      };
    }

    /*filters*/

    const filter = { projectId, isActive: true };

    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.search = { $regex: search, $options: 'i' };
    }
    if (startDate && endDate) {
      filter.startDate = {};

      if (startDate) {
        filter.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.startDate.$lt = new Date(endDate);
      }
    }

    return await DataBaseHelper.findRecords(
      'sprint.model',
      filter,
      {},
      { sort: { status: 1, position: 1 } }
    );
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || sprintConstant.SERVER_ERROR,
    };
  }
};
