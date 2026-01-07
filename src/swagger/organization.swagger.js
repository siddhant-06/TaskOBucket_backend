/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management APIs
 */

/**
 * @swagger
 * /api/organization/create:
 *   post:
 *     tags: [Organization]
 *     summary: Create a new organization
 *     description: |
 *       Creates a new organization and assigns the logged-in user as the organization admin.
 *       A user can belong to only one organization.
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
 *               - organization_key
 *             properties:
 *               name:
 *                 type: string
 *                 example: QB Technologies
 *               organization_key:
 *                 type: string
 *                 example: QB
 *     responses:
 *       201:
 *         description: Organization created successfully
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
 *                   example: Organization created successfully
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65a1c2d3a12b4c001234abcd
 *                     name:
 *                       type: string
 *                       example: QB Technologies
 *                     organization_key:
 *                       type: string
 *                       example: QB
 *                     createdBy:
 *                       type: string
 *                       example: 64f1c2d3a12b4c001234abcd
 *                     createdAt:
 *                       type: string
 *                       example: 2024-01-01T10:00:00.000Z
 *       400:
 *         description: User already belongs to an organization
 *       401:
 *         description: Unauthorized – Token missing or invalid
 *       409:
 *         description: Organization key already exists
 *       500:
 *         description: Internal server error
 */
