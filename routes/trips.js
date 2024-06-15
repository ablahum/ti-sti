var express = require('express')
var router = express.Router()
const auth = require('../middleware')
const { getAll } = require('../controllers/TripController')

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - origin
 *         - destination
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the trip
 *         origin:
 *           type: string
 *           description: The origin location of the trip
 *         destination:
 *           type: string
 *           description: The destination location of the trip
 *         price:
 *           type: integer
 *           description: The price of the trip
 *       example:
 *         id: 1
 *         origin: "bandung"
 *         destination: "ciamis"
 *         price: 250000
 */

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Menampilkan semua list trips yang telah dibuat oleh user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Jika user (baik itu yang memiliki role sebagai user maupun driver) belum melakukan login, maka mengembalikan error Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, getAll)

module.exports = router
