var express = require('express')
var router = express.Router()
const auth = require('../middleware')
const { getOrders, createOrder, cancelOrder, acceptOrder, finishOrder } = require('../controllers/OrderController')

router.get('/', auth, getOrders)
router.post('/', auth, createOrder)
router.put('/:orderId', auth, cancelOrder)
router.put('/:orderId/accept', auth, acceptOrder)
router.put('/:orderId/finish', auth, finishOrder)

module.exports = router
