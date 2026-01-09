import * as DataBaseHelper from '../common/baseRepository.js';
import { constants } from '../common/constant.js';

const issueConstant = constants.Issue;

// service to create issue
export const createIssueService = async (data, user) => {
  try {
    // validate project
    let projectId = null;

    if (data.projectId) {
      projectId = await DataBaseHelper.getRecordById(
        'project.model',
        data.projectId
      );
      if (!projectId) {
        throw { statusCode: 404, message: constants.Project.PROJECT_NOT_FOUND };
      }
      projectId = projectId._id;
    }

    // validate sprint
    let sprintId = null;

    if (data.sprintId) {
      sprintId = await DataBaseHelper.getRecordById(
        'sprint.model',
        data.sprintId
      );

      if (!sprintId) {
        throw { statusCode: 404, message: constants.Sprint.SPRINT_NOT_FOUND };
      }
      sprintId = sprintId._id;
    }

    //Validate assignees
    if (data.assignees?.length) {
      const users = await DataBaseHelper.findRecords('user.model', {
        _id: { $in: data.assignees },
      });

      if (users.length !== data.assignees.length) {
        throw {
          statusCode: 400,
          message: issueConstant.INVALID_ASSIGNEE,
        };
      }
    }

    //Status & position
    const status = data.status || 'BACKLOG';

    const lastIssue = await DataBaseHelper.findRecords(
      'issue.model',
      {
        projectId,
        sprintId,
        status,
      },
      { sort: { position: -1 }, limit: 1 }
    );

    const nextPosition = lastIssue.length ? lastIssue[0].position + 1 : 1;

    return await DataBaseHelper.createRecord('issue.model', {
      title: data.title,
      description: data.description,
      projectId,
      sprintId,
      status,
      position: nextPosition,
      type: data.type, // STORY | TASK | BUG
      priority: data.priority || 'MEDIUM',
      assignees: data.assignees || [],
      reporterId: user._id,
    });
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || issueConstant.ISSUE_NOT_CREATED,
    };
  }
};

// service to update issue
export const updateIssueService = async (issueId, updateData) => {
  try {
    const issue = await DataBaseHelper.getRecordById('issue.model', issueId);

    if (!issue) {
      throw {
        statusCode: 404,
        message: issueConstant.ISSUE_NOT_FOUND,
      };
    }

    /** Validate assignees (if updating) */
    if (updateData.assignees?.length) {
      const users = await DataBaseHelper.findRecords('user.model', {
        _id: { $in: updateData.assignees },
      });

      if (users.length !== updateData.assignees.length) {
        throw {
          statusCode: 400,
          message: issueConstant.INVALID_ASSIGNEE,
        };
      }
    }

    /** Handle drag & drop (optional) */
    if (updateData.status || typeof updateData.position === 'number') {
      const newStatus = updateData.status || issue.status;
      const newPosition = updateData.position ?? issue.position;

      await DataBaseHelper.updateManyRecords(
        'issue.model',
        {
          projectId: issue.projectId,
          sprintId: issue.sprintId,
          status: newStatus,
          position: { $gte: newPosition },
          _id: { $ne: issueId },
        },
        { $inc: { position: 1 } }
      );

      issue.status = newStatus;
      issue.position = newPosition;
    }

    Object.assign(issue, updateData);
    await issue.save();

    return issue;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || issueConstant.ISSUE_NOT_UPDATED,
    };
  }
};
