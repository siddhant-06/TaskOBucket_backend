import express from 'express';
import routeName from '../config/issueRoutes.config.js';
import * as issueController from '../controller/issue.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import {
    createIssueValidation,
    updateIssueValidation,
    getIssueByIdValidation,
    listIssuesValidation,
    deleteIssueValidation,
} from '../validation/issue.validation.js';
import { authGuard } from '../middleware/authGuard.js';

const issueRoutes = express.Router();

// Create issue
issueRoutes.post(
    routeName.create,
    authGuard,
    payloadValidate(createIssueValidation),
    issueController.createIssueController
);

// List issues with filters
issueRoutes.get(
    routeName.list,
    authGuard,
    payloadValidate(listIssuesValidation, 'query'),
    issueController.listIssuesController
);

// Get issue by ID
issueRoutes.get(
    routeName.getById,
    authGuard,
    payloadValidate(getIssueByIdValidation, 'params'),
    issueController.getIssueByIdController
);

// Update issue
issueRoutes.put(
    routeName.update,
    authGuard,
    payloadValidate(updateIssueValidation),
    issueController.updateIssueController
);

// Delete issue
issueRoutes.delete(
    routeName.delete,
    authGuard,
    payloadValidate(deleteIssueValidation, 'params'),
    issueController.deleteIssueController
);

export default issueRoutes;
