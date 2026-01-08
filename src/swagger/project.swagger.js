//? Create Project
/**
 * @swagger
 * /api/project/create:
 *   post:
 *     tags: [Project]
 *     summary: Create a new project
 *     description: >
 *       Allows an organization admin to create a new project inside their organization.
 *       Project key must be unique within the organization.
 *       The creator is automatically assigned as Project Manager (PM).
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
 *               - project_key
 *             properties:
 *               name:
 *                 type: string
 *                 example: WhatsApp Backend
 *               project_key:
 *                 type: string
 *                 example: WA
 *               description:
 *                 type: string
 *                 example: Backend services for WhatsApp clone
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 64f1c2d3a12b4c001234abcd
 *                     role:
 *                       type: string
 *                       enum: [DEV, QA]
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: User does not belong to any organization
 *       403:
 *         description: Only organization admin can create project
 *       409:
 *         description: Project key already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

//? Get Project By ID
/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     tags: [Project]
 *     summary: Get project by ID
 *     description: >
 *       Fetch a single project by its ID.
 *       User must belong to the same organization.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1c2d3a12b4c001234abcd
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

//? Update Project
/**
 * @swagger
 * /api/project/update/{id}:
 *   put:
 *     tags: [Project]
 *     summary: Update project details
 *     description: >
 *       Allows Organization Admin or Project Manager (PM) to update project details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1c2d3a12b4c001234abcd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: WhatsApp Backend V2
 *               description:
 *                 type: string
 *                 example: Updated backend scope
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-02-01
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       403:
 *         description: Only admin or project manager can update project
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
