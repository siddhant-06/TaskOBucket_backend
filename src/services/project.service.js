import * as DataBaseHelper from '../common/baseRepository.js';
import { constants } from '../common/constant.js';

const projectConstant = constants.Project;

// Service to create a new project
export const projectCreateService = async (data, userId) => {
  try {
    // fetch user
    const user = await DataBaseHelper.getRecordById(userId);

    if (!user) {
      throw { statusCode: 404, message: constants.User.USER_NOT_FOUND };
    }

    if (!user.organizationId) {
      throw {
        statusCode: 400,
        message: projectConstant.USER_NO_ORG,
      };
    }

    // Only org admin can create project
    if (!user.isOrgAdmin) {
      throw {
        statusCode: 403,
        message: projectConstant.ONLY_ADMIN,
      };
    }

    // Check project key uniqueness per org

    const existingProject = await DataBaseHelper.findRecords('project.model', {
      organizationId: user.organizationId,
      project_key: data.project_key.toUpperCase(),
    });

    if (existingProject.length) {
      throw {
        statusCode: 409,
        message: projectConstant.PROJECT_KEY_EXISTS,
      };
    }

    // Create project
    const project = await DataBaseHelper.createRecord('project.model', {
      name: data.name,
      project_key: data.project_key.toUpperCase(),
      organizationId: user.organizationId,
      description: data.description,
      leadId: userId,
    });

    await DataBaseHelper.createRecord('projectMember.model', {
      projectId: project._id,
      userId: userId,
      role: 'PM',
    });

    if (data.teamMembers?.length) {
      for (const member of data.teamMembers) {
        await DataBaseHelper.createRecord('projectMember.model', {
          projectId: project._id,
          userId: member.userId,
          role: member.role || 'DEV',
        });
      }
    }
    return project;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || projectConstant.PROJECT_NOT_CREATED,
    };
  }
};

// Service to get a project by ID
export const getProjectByIdService = async (id) => {
  try {
    return await DataBaseHelper.getRecordById('project.model', id);
  } catch (error) {
    throw error;
  }
};

// Service to update a project by ID
export const updateProjectService = async (projectId, updateData, userId) => {
  try {
    // Fetch user
    const user = await DataBaseHelper.getRecordById('user.model', userId);
    if (!user) {
      throw { statusCode: 404, message: constants.User.USER_NOT_FOUND };
    }

    // Fetch project
    const project = await DataBaseHelper.getRecordById(
      'project.model',
      projectId
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
        message: projectConstant.UNAUTHORIZED_PROJECT_ACCESS,
      };
    }

    // Permission check (Admin or PM)
    if (!user.isOrgAdmin) {
      const member = await DataBaseHelper.findRecords('projectMember.model', {
        projectId,
        userId,
        role: 'PM',
      });

      if (!member.length) {
        throw {
          statusCode: 403,
          message: projectConstant.ONLY_ADMIN_OR_PM,
        };
      }
    }

    return await DataBaseHelper.updateRecordById(
      'project.model',
      projectId,
      updateData
    );
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || projectConstant.PROJECT_NOT_UPDATED,
    };
  }
};
