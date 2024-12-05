const express = require("express");
const userController = require("../controllers/users.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

module.exports.setup = (app) => {
  app.use("/api/v1/users", router);

  // /**
  //  * @swagger
  //  * /api/v1/users:
  //  *  get:
  //  *    summary: Get users by filter
  //  *    description: Get users by filter
  //  *    parameters:
  //  *      - in: query
  //  *        name: user_username
  //  *        schema:
  //  *          type: string
  //  *        description: Filter by username
  //  *      - in: query
  //  *        name: user_name
  //  *        schema:
  //  *          type: string
  //  *        description: Filter by user name
  //  *      - in: query
  //  *        name: gender_id
  //  *        schema:
  //  *          type: integer
  //  *        description: Filter by gender ID
  //  *      - in: query
  //  *        name: user_phone
  //  *        schema:
  //  *          type: string
  //  *        description: Filter by phone number
  //  *      - in: query
  //  *        name: user_role
  //  *        schema:
  //  *          type: integer
  //  *        description: Filter by role ID
  //  *      - $ref: '#/components/parameters/limitParam'
  //  *      - $ref: '#/components/parameters/pageParam'
  //  *    tags:
  //  *      - users
  //  *    responses:
  //  *      200:
  //  *        description: A list of users
  //  *        content:
  //  *          application/json:
  //  *            schema:
  //  *              type: object
  //  *              properties:
  //  *                status:
  //  *                  type: string
  //  *                  description: The response status
  //  *                  enum: [success]
  //  *                data:
  //  *                  type: object
  //  *                  properties:
  //  *                    users:
  //  *                      type: array
  //  *                      items:
  //  *                        $ref: '#/components/schemas/User'
  //  *                    metadata:
  //  *                      $ref: '#/components/schemas/PaginationMetadata'
  //  */
  // router.get("/", userController.getUsersByFilter);

  // /**
  //  * @swagger
  //  * /api/v1/users:
  //  *  post:
  //  *    summary: Create a new user
  //  *    description: Create a new user
  //  *    requestBody:
  //  *      required: true
  //  *      content:
  //  *        application/json:
  //  *          schema:
  //  *            type: object
  //  *            properties:
  //  *              user_username:
  //  *                type: string
  //  *                description: User's username
  //  *              user_password:
  //  *                type: string
  //  *                description: User's password
  //  *              user_name:
  //  *                type: string
  //  *                description: User's name
  //  *              gender_id:
  //  *                type: integer
  //  *                description: ID of the user's gender
  //  *              user_phone:
  //  *                type: string
  //  *                description: User's phone number
  //  *              user_email:
  //  *                type: string
  //  *                description: User's email address
  //  *              user_role:
  //  *                type: integer
  //  *                description: Role ID of the user
  //  *              user_address_id:
  //  *                type: integer
  //  *                description: ID of the user's address
  //  *    tags:
  //  *      - users
  //  *    responses:
  //  *      201:
  //  *        description: A new user has been created
  //  *        content:
  //  *          application/json:
  //  *            schema:
  //  *              type: object
  //  *              properties:
  //  *                status:
  //  *                  type: string
  //  *                  description: The response status
  //  *                  enum: [success]
  //  *                data:
  //  *                  type: object
  //  *                  properties:
  //  *                    user:
  //  *                      $ref: '#/components/schemas/User'
  //  */
  // router.post("/", userController.createUser);

  /**
   * @swagger
   * /api/v1/users:
   *  get:
   *    summary: Get users by filter
   *    description: Get users by filter    
   *    parameters:
   *      - in: query
   *        name: user_username
   *        schema:
   *          type: string
   *        description: Filter by username
   *      - in: query
   *        name: user_name
   *        schema:
   *          type: string
   *        description: Filter by user name
   *      - in: query
   *        name: gender_id
   *        schema:
   *          type: integer
   *        description: Filter by gender ID
   *      - in: query
   *        name: user_phone
   *        schema:
   *          type: string
   *        description: Filter by phone number
   *      - in: query
   *        name: user_role
   *        schema:
   *          type: integer
   *        description: Filter by role ID
   *      - $ref: '#/components/parameters/limitParam'
   *      - $ref: '#/components/parameters/pageParam'
   *    tags:
   *      - users
   *    responses:
   *      200:
   *        description: A list of users
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    users:
   *                      type: array
   *                      items:
   *                        $ref: '#/components/schemas/User'
   *                    metadata:
   *                      $ref: '#/components/schemas/PaginationMetadata'
   */
  router.get("/", userController.getUsersByFilter);

  /**
   * @swagger
   * /api/v1/users:
   *  post:
   *    summary: Create a new user
   *    description: Create a new user, including optional address details.
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              user_username:
   *                type: string
   *                description: User's username
   *              user_password:
   *                type: string
   *                description: User's password
   *              user_name:
   *                type: string
   *                description: User's name
   *              gender_id:
   *                type: integer
   *                description: ID of the user's gender
   *              user_phone:
   *                type: string
   *                description: User's phone number
   *              user_email:
   *                type: string
   *                description: User's email address
   *              user_role:
   *                type: integer
   *                description: Role ID of the user
   *              user_address:
   *                type: object
   *                description: User's address details
   *                properties:
   *                  street:
   *                    type: string
   *                    description: Street address of the user
   *                  province_code:
   *                    type: integer
   *                    description: Province code of the user
   *                  district_code:
   *                    type: integer
   *                    description: District code of the user
   *                  ward_code:
   *                    type: integer
   *                    description: Ward code of the user
   *    tags:
   *      - users
   *    responses:
   *      201:
   *        description: A new user has been created
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    user:
   *                      $ref: '#/components/schemas/User'
   */
  router.post("/", userController.createUser);

  /**
   * @swagger
   * /api/v1/users:
   *  delete:
   *    summary: Delete all users
   *    description: Delete all users
   *    tags:
   *      - users
   *    responses:
   *      200:
   *        description: All users deleted
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                message:
   *                  type: string
   *                  description: Confirmation message
   *                  example: All users have been deleted
   */
  router.delete("/", authenticateToken, userController.deleteAllUsers);
  router.all("/", methodNotAllowed);

  /**
   * @swagger
   * /api/v1/users/{user_id}:
   *  get:
   *    summary: Get user by ID
   *    description: Get user by ID
   *    parameters:
   *      - name: user_id
   *        in: path
   *        required: true
   *        schema:
   *          type: integer
   *        description: The ID of the user
   *    tags:
   *      - users
   *    responses:
   *      200:
   *        description: A user
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    user:
   *                      $ref: '#/components/schemas/User'
   */
  router.get("/:user_id", userController.getUser);

  /**
   * @swagger
   * /api/v1/users/{user_id}:
   *  put:
   *    summary: Update user by ID
   *    description: Update a user by ID
   *    parameters:
   *      - in: path
   *        name: user_id
   *        required: true
   *        schema:
   *          type: integer
   *        description: ID of the user to update
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              user_username:
   *                type: string
   *                description: User's username
   *              user_name:
   *                type: string
   *                description: User's name
   *              gender_id:
   *                type: integer
   *                description: ID of the user's gender
   *              user_phone:
   *                type: string
   *                description: User's phone number
   *              user_email:
   *                type: string
   *                description: User's email address
   *              user_role:
   *                type: integer
   *                description: Role ID of the user
   *              user_address_id:
   *                type: integer
   *                description: ID of the user's address
   *    tags:
   *      - users
   *    responses:
   *      200:
   *        description: The updated user
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    user:
   *                      $ref: '#/components/schemas/User'
   */
  router.put("/:user_id", authenticateToken, userController.updateUser);

  /**
   * @swagger
   * /api/v1/users/{user_id}:
   *  delete:
   *    summary: Delete user by ID
   *    description: Delete user by ID
   *    parameters:
   *      - in: path
   *        name: user_id
   *        required: true
   *        schema:
   *          type: integer
   *        description: The ID of the user to delete
   *    tags:
   *      - users
   *    responses:
   *      200:
   *        description: User deleted
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                message:
   *                  type: string
   *                  description: Confirmation message
   *                  example: User has been deleted
   */
  router.delete("/:user_id", authenticateToken, userController.deleteUser);

  /**
   * @swagger
   * /api/v1/users/login:
   *  post:
   *    summary: Login a user
   *    description: Authenticate user credentials
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              user_username:
   *                type: string
   *                description: User's username
   *              user_password:
   *                type: string
   *                description: User's password
   *    tags:
   *      - users
   *    responses:
   *      200:
   *        description: Login successful
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    message:
   *                      type: string
   *                    user:
   *                      $ref: '#/components/schemas/User'
   */
  router.post("/login", userController.loginUser);
};
