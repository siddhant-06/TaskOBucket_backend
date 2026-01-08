import * as DataBaseHelper from '../common/baseRepository.js';
import { constants } from '../common/constant.js';

const projectConstant = constants.Project;
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
          role: member.role,
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

export const projectListService = async ({ limit, page, search, user }) => {
  try {
    const filter = {
      organizationId: user.organizationId,
      isActive: true,
    };

    /** Search by project name or key */
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { project_key: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'leadId', select: 'name email' }],
    };

    return await DataBaseHelper.getAllRecords('project.model', filter, options);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch projects',
    };
  }
};

export const projectDeleteService = async (projectId, user) => {
  try {
    if (!user?.organizationId) {
      throw { statusCode: 401, message: 'Invalid user context' };
    }

    const filter = {
      _id: projectId,
      organizationId: user.organizationId,
    };

    const result = await DataBaseHelper.deleteRecordsByKey(
      'project.model',
      filter
    );

    if (!result.deletedCount) {
      throw { statusCode: 404, message: 'Project not found' };
    }

    return result;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete project',
    };
  }
};
export const projectBulkDeleteService = async (projectIds, user) => {
  try {
    if (!user?.organizationId) {
      throw { statusCode: 401, message: 'Invalid user context' };
    }

    const filter = {
      _id: { $in: projectIds },
      organizationId: user.organizationId,
    };

    return await DataBaseHelper.deleteManyRecords('project.model', filter);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete projects',
    };
  }
};
