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
 *     responses:
 *       201:
 *         description: Project created successfully
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
 *                   example: Project created successfully
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f1c2d3a12b4c001234abcd
 *                     name:
 *                       type: string
 *                       example: WhatsApp Backend
 *                     project_key:
 *                       type: string
 *                       example: WA
 *                     organizationId:
 *                       type: string
 *                       example: 64e9c8d3a12b4c001111aaaa
 *                     leadId:
 *                       type: string
 *                       example: 64e9c8d3a12b4c009999bbbb
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
