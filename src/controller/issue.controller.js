// controller/issue.controller.js
import * as IssueService from '../services/issue.service.js';
import { constants } from '../common/constant.js';
import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';

const issueConstant = constants.Issue || {
    ISSUE_CREATED: 'Issue created successfully',
    ISSUE_UPDATED: 'Issue updated successfully',
    ISSUE_FETCHED: 'Issue fetched successfully',
    ISSUE_LIST_FETCHED: 'Issue list fetched successfully',
    ISSUE_DELETED: 'Issue deleted successfully',
    SERVER_ERROR: 'Internal Server Error',
};

// Controller to create issue
export const createIssueController = async (req, res) => {
    try {
        const issue = await IssueService.createIssueService(req.body, req.user);

        return sendSuccessResponse(res, issueConstant.ISSUE_CREATED, issue, 201);
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message);
    }
};

// Controller to update issue
export const updateIssueController = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await IssueService.updateIssueService(id, req.body, req.user);

        return sendSuccessResponse(res, issueConstant.ISSUE_UPDATED, issue);
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message);
    }
};

// Controller to get issue by ID
export const getIssueByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await IssueService.getIssueByIdService(id, req.user);

        return sendSuccessResponse(res, issueConstant.ISSUE_FETCHED, issue);
    } catch (error) {
        return sendErrorResponse(
            res,
            error.statusCode || 500,
            error.message || issueConstant.SERVER_ERROR
        );
    }
};

// Controller to list issues with filters
export const listIssuesController = async (req, res) => {
    try {
        const { projectId, sprintId, status, type, priority, search, assignee } = req.query;

        const issues = await IssueService.listIssuesService(
            {
                projectId,
                sprintId,
                status,
                type,
                priority,
                search,
                assignee,
            },
            req.user
        );

        return sendSuccessResponse(res, issueConstant.ISSUE_LIST_FETCHED, issues);
    } catch (error) {
        return sendErrorResponse(
            res,
            error.statusCode || 500,
            error.message || issueConstant.SERVER_ERROR
        );
    }
};

// Controller to delete issue
export const deleteIssueController = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await IssueService.deleteIssueService(id, req.user);

        return sendSuccessResponse(res, issueConstant.ISSUE_DELETED, result);
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message);
    }
};
