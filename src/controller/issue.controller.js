// controller/sprint.controller.js
import * as IssueService from '../services/issue.service.js';
import { constants } from '../common/constant.js';
import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';

const issueConstant = constants.Issue;

export const createIssueController = async (req, res) => {
  try {
    const issue = await IssueService.createIssueService(req.body, req.user);
    return sendSuccessResponse(res, issueConstant.ISSUE_CREATED, issue, 201);
  } catch (error) {
    return sendErrorResponse(res, error.statusCode || 500, error.message);
  }
};

export const updateIssueController = async (req, res) => {
  try {
    const issue = await IssueService.updateIssueService(
      req.params.id,
      req.body
    );
    return sendSuccessResponse(res, issueConstant.ISSUE_UPDATED, issue);
  } catch (error) {
    return sendErrorResponse(res, error.statusCode || 500, error.message);
  }
};
