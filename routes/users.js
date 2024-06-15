var express = require('express')
var router = express.Router()
const { check } = require('express-validator')
const { getAll, login, register } = require('../controllers/UserController')

const validateLogin = [check('name').notEmpty().withMessage('name is required'), check('password').notEmpty().withMessage('password is required')]

const validateRegister = [
  check('name').notEmpty().withMessage('name is required'),
  check('password').isLength({ min: 4 }).withMessage('password must be at least 4 characters long'),
  check('role_id').isInt().withMessage('role ID must be an integer'),
]

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - password
 *         - role_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role_id:
 *           type: integer
 *           description: The role of the user
 *       example:
 *         id: 2
 *         name: "tama"
 *         password: "$2b$10$fT5NG.kQDrFlZoBnRHXkZ.mYzF5QQUo8l5TpDEZjegZ8bxmr7IdWS"
 *         role_id: 1
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Menampilkan semua user yang telah registrasi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/', getAll)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "tama"
 *               password:
 *                 type: string
 *                 example: "tama123"
 *     responses:
 *       200:
 *         description: User melakukan login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "login successful"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: "jwt_token"
 *       404:
 *         description: Jika user memberikan name dan password yang salah, maka menampilkan error 404 (data user tidak ada di database)
 *       500:
 *         description: Server error
 */
router.post('/login', validateLogin, login)

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - role_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "tama"
 *               password:
 *                 type: string
 *                 example: "tama123"
 *               role_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User melakukan registrasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "register successful"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.post('/register', validateRegister, register)

module.exports = router
