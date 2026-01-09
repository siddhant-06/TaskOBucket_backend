//? Create Sprint
/**
 * @swagger
 * /api/sprint/create:
 *   post:
 *     tags: [Sprint]
 *     summary: Create a new sprint
 *     description: |
 *       Creates a new sprint under a project.
 *       - Only organization admins can create sprints
 *       - Sprint is created in a Kanban column with automatic position handling
 *       - Position is assigned as the last item in the selected status column
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - projectId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sprint 1
 *               projectId:
 *                 type: string
 *                 example: 64f1c2d3a12b4c001234abcd
 *               description:
 *                 type: string
 *                 example: Initial development sprint
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-06-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-06-15
 *               status:
 *                 type: string
 *                 enum: [BACKLOG, SELECTED, IN_PROGRESS, DONE]
 *                 example: BACKLOG
 *     responses:
 *       201:
 *         description: Sprint created successfully
 *       400:
 *         description: Validation error or invalid date range
 *       403:
 *         description: Unauthorized or insufficient permissions
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

//? Update Sprint
/**
 * @swagger
 * /api/sprint/{id}:
 *   put:
 *     tags: [Sprint]
 *     summary: Update sprint details or reorder sprint
 *     description: |
 *       Updates sprint information or handles Kanban drag-and-drop behavior.
 *       Supports:
 *       - Moving sprint between columns (status change)
 *       - Reordering sprint within the same column (position change)
 *       - Backend automatically shifts positions to prevent duplicates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65a1c2d3a12b4c001234abcd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sprint Alpha
 *               description:
 *                 type: string
 *                 example: Updated sprint scope
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-06-02
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-06-20
 *               status:
 *                 type: string
 *                 enum: [BACKLOG, SELECTED, IN_PROGRESS, DONE]
 *                 example: IN_PROGRESS
 *               position:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Sprint updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Only admin can update sprint
 *       404:
 *         description: Sprint not found
 *       500:
 *         description: Internal server error
 */

//? Get Sprint By ID
/**
 * @swagger
 * /api/sprint/{id}:
 *   get:
 *     tags: [Sprint]
 *     summary: Get sprint by ID
 *     description: >
 *       Fetch a single sprint by its ID.
 *       Used when opening sprint details or editing a sprint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 65b2f9c1a12b4c001234abcd
 *     responses:
 *       200:
 *         description: Sprint fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Sprint fetched successfully
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: Sprint 1
 *                     projectId:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: BACKLOG
 *                     position:
 *                       type: number
 *                       example: 1
 *                     startDate:
 *                       type: string
 *                       example: 2024-02-01T00:00:00.000Z
 *                     endDate:
 *                       type: string
 *                       example: 2024-02-15T00:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unauthorized project access
 *       404:
 *         description: Sprint not found
 *       500:
 *         description: Internal server error
 */

//? List Sprints (Kanban Board)
/**
 * @swagger
 * /api/sprint/list:
 *   get:
 *     tags: [Sprint]
 *     summary: List sprints for Kanban board
 *     description: >
 *       Fetch all sprints of a project for Kanban dashboard.
 *       Supports filtering by status, search, and date range.
 *       Sprints are ordered by status and position.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 65a1c2d3a12b4c001234abcd
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [BACKLOG, SELECTED, IN_PROGRESS, DONE]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Sprint
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           example: 2024-02-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           example: 2024-02-28
 *     responses:
 *       200:
 *         description: Sprint list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Sprint list fetched successfully
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       projectId:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: BACKLOG
 *                       position:
 *                         type: number
 *                         example: 2
 *                       startDate:
 *                         type: string
 *                       endDate:
 *                         type: string
 *       400:
 *         description: Project ID required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unauthorized project access
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
