// services/issue.service.js
import * as DataBaseHelper from '../common/baseRepository.js';
import { constants } from '../common/constant.js';

const issueConstant = constants.Issue || {};
const projectConstant = constants.Project;
const sprintConstant = constants.Sprint;

// Service to create a new issue
export const createIssueService = async (data, user) => {
    try {
        if (!user.organizationId) {
            throw { statusCode: 400, message: 'User does not belong to any organization' };
        }

        // Project validation
        const project = await DataBaseHelper.getRecordById('project.model', data.projectId);

        if (!project) {
            throw {
                statusCode: 404,
                message: projectConstant.PROJECT_NOT_FOUND,
            };
        }

        // Organization check
        if (project.organizationId.toString() !== user.organizationId.toString()) {
            throw {
                statusCode: 403,
                message: projectConstant.UNAUTHORIZED_PROJECT_ACCESS,
            };
        }

        // Sprint validation (if provided)
        if (data.sprintId) {
            const sprint = await DataBaseHelper.getRecordById('sprint.model', data.sprintId);

            if (!sprint) {
                throw {
                    statusCode: 404,
                    message: sprintConstant.SPRINT_NOT_FOUND,
                };
            }

            // Verify sprint belongs to the same project
            if (sprint.projectId.toString() !== data.projectId.toString()) {
                throw {
                    statusCode: 400,
                    message: 'Sprint does not belong to the specified project',
                };
            }
        }

        // Date validation
        if (
            data.startDate &&
            data.dueDate &&
            new Date(data.startDate) >= new Date(data.dueDate)
        ) {
            throw {
                statusCode: 400,
                message: 'Start date must be before due date',
            };
        }

        // Find last position in the column
        const lastIssue = await DataBaseHelper.findRecords(
            'issue.model',
            {
                projectId: data.projectId,
                sprintId: data.sprintId || null,
                status: data.status || 'BACKLOG',
            },
            { sort: { position: -1 }, limit: 1 }
        );

        const nextPosition = lastIssue.length ? lastIssue[0].position + 1 : 1;

        // Create issue
        return await DataBaseHelper.createRecord('issue.model', {
            title: data.title,
            description: data.description,
            projectId: data.projectId,
            sprintId: data.sprintId || null,
            status: data.status || 'BACKLOG',
            position: nextPosition,
            type: data.type || 'TASK',
            priority: data.priority || 'MEDIUM',
            assignees: data.assignees || [],
            tags: data.tags || [],
            startDate: data.startDate,
            dueDate: data.dueDate,
            reporterId: user._id,
        });
    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || 'Issue creation failed',
        };
    }
};

// Service to update an issue
export const updateIssueService = async (issueId, updateData, user) => {
    try {
        const issue = await DataBaseHelper.getRecordById('issue.model', issueId);

        if (!issue) {
            throw { statusCode: 404, message: 'Issue not found' };
        }

        // Project check for organization validation
        const project = await DataBaseHelper.getRecordById('project.model', issue.projectId);

        if (!project) {
            throw { statusCode: 404, message: projectConstant.PROJECT_NOT_FOUND };
        }

        // Organization check
        if (project.organizationId.toString() !== user.organizationId.toString()) {
            throw {
                statusCode: 403,
                message: projectConstant.UNAUTHORIZED_PROJECT_ACCESS,
            };
        }

        // Permission check: org admin OR assignee
        if (!user.isOrgAdmin) {
            const isAssignee = issue.assignees.some(
                (assigneeId) => assigneeId.toString() === user._id.toString()
            );

            if (!isAssignee && issue.reporterId.toString() !== user._id.toString()) {
                throw {
                    statusCode: 403,
                    message: 'Only organization admin, assignees, or reporter can update issue',
                };
            }
        }

        // If sprintId is being updated, validate it
        if (updateData.sprintId !== undefined && updateData.sprintId !== null) {
            const sprint = await DataBaseHelper.getRecordById('sprint.model', updateData.sprintId);

            if (!sprint) {
                throw { statusCode: 404, message: sprintConstant.SPRINT_NOT_FOUND };
            }

            if (sprint.projectId.toString() !== issue.projectId.toString()) {
                throw {
                    statusCode: 400,
                    message: 'Sprint does not belong to the issue project',
                };
            }
        }

        // If status or position changed → reorder
        if (updateData.status || typeof updateData.position === 'number') {
            const newStatus = updateData.status || issue.status;
            const newSprintId = updateData.sprintId !== undefined ? updateData.sprintId : issue.sprintId;

            let newPosition = updateData.position;

            // If moved to another column/sprint and position not provided
            if ((updateData.status || updateData.sprintId !== undefined) && typeof updateData.position !== 'number') {
                const lastIssue = await DataBaseHelper.findRecords(
                    'issue.model',
                    {
                        projectId: issue.projectId,
                        sprintId: newSprintId,
                        status: newStatus
                    },
                    { sort: { position: -1 }, limit: 1 }
                );

                newPosition = lastIssue.length ? lastIssue[0].position + 1 : 1;
            }

            // Shift other issues to make room
            await DataBaseHelper.updateManyRecords(
                'issue.model',
                {
                    projectId: issue.projectId,
                    sprintId: newSprintId,
                    status: newStatus,
                    position: { $gte: newPosition },
                    _id: { $ne: issueId },
                },
                { $inc: { position: 1 } }
            );

            issue.status = newStatus;
            issue.position = newPosition;
            if (updateData.sprintId !== undefined) {
                issue.sprintId = newSprintId;
            }
        }

        // Apply other updates
        Object.assign(issue, updateData);
        await issue.save();

        return issue;
    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || 'Issue update failed',
        };
    }
};

// Service to get issue by ID
export const getIssueByIdService = async (issueId, user) => {
    try {
        const issue = await DataBaseHelper.getRecordById('issue.model', issueId);

        if (!issue) {
            throw { statusCode: 404, message: 'Issue not found' };
        }

        // Project check for organization validation
        const project = await DataBaseHelper.getRecordById('project.model', issue.projectId);

        if (!project) {
            throw { statusCode: 404, message: projectConstant.PROJECT_NOT_FOUND };
        }

        // Organization check
        if (project.organizationId.toString() !== user.organizationId.toString()) {
            throw {
                statusCode: 403,
                message: projectConstant.UNAUTHORIZED_PROJECT_ACCESS,
            };
        }

        return issue;
    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch issue',
        };
    }
};

// Service to list issues with filters
export const listIssuesService = async (filters, user) => {
    try {
        const { projectId, sprintId, status, type, priority, search, assignee } = filters;

        if (!projectId) {
            throw { statusCode: 400, message: projectConstant.PROJECT_ID_REQUIRED };
        }

        // Project validation
        const project = await DataBaseHelper.getRecordById('project.model', projectId);

        if (!project) {
            throw { statusCode: 404, message: projectConstant.PROJECT_NOT_FOUND };
        }

        // Organization check
        if (project.organizationId.toString() !== user.organizationId.toString()) {
            throw {
                statusCode: 403,
                message: projectConstant.UNAUTHORIZED_PROJECT_ACCESS,
            };
        }

        // Build filter
        const filter = { projectId, isActive: true };

        if (sprintId) {
            filter.sprintId = sprintId;
        }

        if (status) {
            filter.status = status;
        }

        if (type) {
            filter.type = type;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (assignee) {
            filter.assignees = assignee;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Fetch issues sorted by position
        return await DataBaseHelper.findRecords(
            'issue.model',
            filter,
            {},
            { sort: { status: 1, position: 1 } }
        );
    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to list issues',
        };
    }
};

// Service to delete issue
export const deleteIssueService = async (issueId, user) => {
    try {
        const issue = await DataBaseHelper.getRecordById('issue.model', issueId);

        if (!issue) {
            throw { statusCode: 404, message: 'Issue not found' };
        }

        // Project check for organization validation
        const project = await DataBaseHelper.getRecordById('project.model', issue.projectId);

        if (!project) {
            throw { statusCode: 404, message: projectConstant.PROJECT_NOT_FOUND };
        }

        // Organization check
        if (project.organizationId.toString() !== user.organizationId.toString()) {
            throw {
                statusCode: 403,
                message: projectConstant.UNAUTHORIZED_PROJECT_ACCESS,
            };
        }

        // Permission check: only org admin can delete
        if (!user.isOrgAdmin) {
            throw {
                statusCode: 403,
                message: 'Only organization admin can delete issues',
            };
        }

        // Delete the issue
        const result = await DataBaseHelper.deleteRecordById('issue.model', issueId);

        return result;
    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to delete issue',
        };
    }
};
