const Order = require('../models/Order')
const User = require('../models/User')
const Trip = require('../models/Trip')
const { validationResult } = require('express-validator')

const getOrders = async (req, res) => {
  const userId = req.user.id

  try {
    const user = await User.findByPk(userId)

    if (user.role_id !== 1) {
      const orders = await Order.findAll({
        where: {
          user_id: userId,
        },
      })

      return res.status(200).json({
        message: 'get your orders successful',
        data: orders,
      })
    } else {
      const orders = await Order.findAll({
        where: {
          status: 'pending',
        },
      })

      return res.status(200).json({
        message: 'get available orders successful',
        data: orders,
      })
    }
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      details: err.errors,
    })
  }
}

const createOrder = async (req, res) => {
  const userId = req.user.id
  const { origin, destination, date } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array(),
    })

  try {
    const user = await User.findByPk(userId)
    const price = 250000

    if (user.role_id !== 2)
      return res.status(401).json({
        msg: 'only user can create order',
      })

    const newTrip = await Trip.create({
      origin,
      destination,
      price,
    })

    const newOrder = await Order.create({
      user_id: userId,
      trip_id: newTrip.id,
      date,
    })

    return res.status(201).json({
      msg: 'create order successful',
      trip: newTrip,
      order: newOrder,
    })
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      details: err.errors,
    })
  }
}

const cancelOrder = async (req, res) => {
  const userId = req.user.id
  const { orderId } = req.params

  try {
    const user = await User.findByPk(userId)

    if (user.role_id !== 2)
      return res.status(401).json({
        msg: 'only user can cancel order',
      })

    const order = await Order.findByPk(orderId)

    if (!order)
      return res.status(404).json({
        msg: 'order not found',
      })

    if (order.user_id !== userId) {
      return res.status(401).json({
        msg: 'you are not allowed to cancel this order',
      })
    } else if (order.status === 'canceled') {
      return res.status(400).json({
        msg: 'order already canceled',
      })
    } else if (order.status === 'on-going' || order.status === 'finished') {
      return res.status(400).json({
        msg: 'only pending orders are allowed to be canceled',
      })
    }

    order.status = 'canceled'
    await order.save()

    return res.status(200).json({
      msg: 'order canceled successfully',
      order,
    })
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      details: err.errors,
    })
  }
}

const acceptOrder = async (req, res) => {
  const { orderId } = req.params
  const driverId = req.user.id

  try {
    const user = await User.findByPk(driverId)

    if (user.role_id !== 1)
      return res.status(403).json({
        msg: 'only drivers can accept orders',
      })

    const order = await Order.findByPk(orderId)

    if (!order)
      return res.status(404).json({
        msg: 'order not found',
      })

    if (order.status !== 'pending')
      return res.status(400).json({
        msg: 'order is not available',
      })

    order.driver_id = driverId
    order.status = 'on-going'
    await order.save()

    res.status(200).json({
      msg: 'order accepted',
      order,
    })
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      details: err.errors,
    })
  }
}

const finishOrder = async (req, res) => {
  const { orderId } = req.params
  const userId = req.user.id

  try {
    const order = await Order.findByPk(orderId)

    if (!order)
      return res.status(404).json({
        msg: 'order not found',
      })

    if (order.status !== 'on-going')
      return res.status(404).json({
        msg: 'only on-going orders are allowed to be finished',
      })

    if (order.user_id !== userId && order.driver_id !== userId)
      return res.status(403).json({
        msg: 'you are not authorized to finish this order',
      })

    order.status = 'finished'
    await order.save()

    res.status(200).json({
      msg: 'order status updated to finished',
      order,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = {
  getOrders,
  createOrder,
  cancelOrder,
  acceptOrder,
  finishOrder,
}
