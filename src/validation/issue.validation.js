import Joi from 'joi';

export const createIssueValidation = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000).optional(),
    projectId: Joi.string().length(24).hex().required(),
    sprintId: Joi.string().length(24).hex().optional().allow(null),
    type: Joi.string().valid('STORY', 'TASK', 'BUG').default('TASK'),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').default('MEDIUM'),
    assignees: Joi.array().items(Joi.string().length(24).hex()).optional(),
    tags: Joi.array()
        .items(Joi.string().valid('FRONTEND', 'BACKEND', 'QA'))
        .optional(),
    startDate: Joi.date().optional(),
    dueDate: Joi.date().optional().greater(Joi.ref('startDate')),
});

export const updateIssueValidation = Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().max(2000).optional(),
    sprintId: Joi.string().length(24).hex().optional().allow(null),
    status: Joi.string()
        .valid('BACKLOG', 'SELECTED', 'IN_PROGRESS', 'DONE')
        .optional(),
    position: Joi.number().integer().min(1).optional(),
    type: Joi.string().valid('STORY', 'TASK', 'BUG').optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
    assignees: Joi.array().items(Joi.string().length(24).hex()).optional(),
    tags: Joi.array()
        .items(Joi.string().valid('FRONTEND', 'BACKEND', 'QA'))
        .optional(),
    startDate: Joi.date().optional(),
    dueDate: Joi.date().optional(),
    isActive: Joi.boolean().optional(),
}).min(1); // at least one field required

export const getIssueByIdValidation = Joi.object({
    id: Joi.string().length(24).hex().required(),
});

export const listIssuesValidation = Joi.object({
    projectId: Joi.string().length(24).hex().required(),
    sprintId: Joi.string().length(24).hex().optional(),
    status: Joi.string()
        .valid('BACKLOG', 'SELECTED', 'IN_PROGRESS', 'DONE')
        .optional(),
    type: Joi.string().valid('STORY', 'TASK', 'BUG').optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
    search: Joi.string().min(1).optional(),
    assignee: Joi.string().length(24).hex().optional(),
});

export const deleteIssueValidation = Joi.object({
    id: Joi.string().length(24).hex().required(),
});
