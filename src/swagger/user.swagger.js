/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/user/user-create:
 *   post:
 *     tags: [User]
 *     summary: Create a new user
 *     description: Creates a new user with hashed password. Does not log the user in.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               jobTitle:
 *                 type: string
 *                 example: Backend Developer
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               avatarUrl:
 *                 type: string
 *                 example: https://cdn.example.com/avatar.png
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: User created successfully
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f1c2d3a12b4c001234abcd
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     jobTitle:
 *                       type: string
 *                       example: Backend Developer
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     avatarUrl:
 *                       type: string
 *                       example: https://cdn.example.com/avatar.png
 *                     createdAt:
 *                       type: string
 *                       example: 2024-01-01T10:00:00.000Z
 *       409:
 *         description: Email already exists
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
