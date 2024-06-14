const Trip = require('../models/Trip')

const getAll = async (req, res, next) => {
  try {
    const data = await Trip.findAll()

    return res.status(200).json({
      message: 'get all trips successful',
      data,
    })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  getAll,
}
