/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

//? User Create
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

//? List all User

/**
 * @swagger
 * /api/user/list:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     description: Fetches all users with optional pagination and search. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: John
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

//? User get by id
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user by ID
 *     description: Fetch a single user by user ID. Requires authentication.
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
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

//? Update User
/**
 * @swagger
 * /api/user/user-update/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update user
 *     description: Update user details such as name, job title, avatar, or status. Requires authentication.
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
 *                 example: John Doe
 *               jobTitle:
 *                 type: string
 *                 example: Senior Backend Developer
 *               avatarUrl:
 *                 type: string
 *                 example: https://cdn.example.com/avatar.png
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

//? Delete User by id

/**
 * @swagger
 * /api/user/user-delete/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete user by ID
 *     description: Deletes a single user by ID. Requires authentication.
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
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

//? Delete all users
/**
 * @swagger
 * /api/user/user-delete:
 *   put:
 *     tags: [User]
 *     summary: Delete multiple users
 *     description: Deletes multiple users by IDs. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 64f1c2d3a12b4c001234abcd
 *     responses:
 *       200:
 *         description: Users deleted successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
