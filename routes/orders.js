var express = require('express')
var router = express.Router()
const { check } = require('express-validator')
const auth = require('../middleware')
const { getOrders, createOrder, cancelOrder, acceptOrder, finishOrder } = require('../controllers/OrderController')

const validateCreateOrder = [check('origin').isString().withMessage('origin must be a string'), check('destination').isString().withMessage('destination must be a string'), check('date').isString().withMessage('date must be a valid date')]

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user_id
 *         - trip_id
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the order
 *         user_id:
 *           type: integer
 *           description: The id of the user who created the order
 *         trip_id:
 *           type: integer
 *           description: The id of the trip associated with the order
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the order
 *         status:
 *           type: string
 *           description: The status of the order
 *         driver_id:
 *           type: integer
 *           description: The id of the driver who accepted the order
 *       example:
 *         id: 1
 *         user_id: 2
 *         trip_id: 3
 *         date: "2023-06-12"
 *         status: "pending"
 *         driver_id: null
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menampilkan orders (jika yang login adalah seorang driver, maka response berupa list orders yang tersedia untuk diterima (orders yang berstatus pending), jika user yang login, maka response berupa list semua orders yang user tersebut miliki, baik itu orders yang berstatus pending, on-going, canceled, maupun finished)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Jika user belum melakukan login, maka mengembalikan error Unauthorized
 */
router.get('/', auth, getOrders)

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - date
 *             properties:
 *               origin:
 *                 type: string
 *                 example: "jakarta"
 *               destination:
 *                 type: string
 *                 example: "bandung"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-01"
 *     responses:
 *       201:
 *         description: Membuat order (hanya untuk user yang memiliki role sebagai user dan telah login yang dapat membuat order)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Jika user belum melakukan login, maka mengembalikan error Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth, validateCreateOrder, createOrder)

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: Membatalkan order (hanya untuk user yang memiliki role sebagai user dan telah login yang dapat membatalkan order)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Jika user belum melakukan login, maka mengembalikan error Unauthorized
 *       404:
 *         description: Order ID yang diberikan di parameter tidak terdapat pada table orders
 *       500:
 *         description: Server error
 */
router.put('/:orderId/cancel', auth, cancelOrder)

/**
 * @swagger
 * /api/orders/{orderId}/accept:
 *   put:
 *     summary: Accept an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: Menerima order (hanya untuk user yang memiliki role sebagai driver dan telah login yang dapat menerima order)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Jika user (driver) belum melakukan login, maka mengembalikan error Unauthorized
 *       404:
 *         description: Order ID yang diberikan di parameter tidak terdapat pada table orders
 *       500:
 *         description: Server error
 */
router.put('/:orderId/accept', auth, acceptOrder)

/**
 * @swagger
 * /api/orders/{orderId}/finish:
 *   put:
 *     summary: Finish an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: Menyelesaikan order (user dengan role user atau driver dan telah login yang dapat menyelesaikan order)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Jika user (baik itu yang memiliki role sebagai user maupun driver) belum melakukan login, maka mengembalikan error Unauthorized
 *       404:
 *         description: Order ID yang diberikan di parameter tidak terdapat pada table orders
 *       500:
 *         description: Server error
 */
router.put('/:orderId/finish', auth, finishOrder)

module.exports = router
