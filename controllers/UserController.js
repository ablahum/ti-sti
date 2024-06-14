const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// const JWT_SECRET = 'jwtSecret'

const { JWT_SECRET } = process.env

const getAll = async (req, res, next) => {
  try {
    const data = await User.findAll()

    return res.status(200).json({
      msg: 'get all users successful',
      data,
    })
  } catch (err) {
    console.error(err)
  }
}

const login = async (req, res, next) => {
  const { name, password } = req.body

  try {
    const user = await User.findOne({ where: { name } })
    const isMatch = await bcrypt.compare(password, user.password)

    if (!user || !isMatch)
      return res.status(404).json({
        msg: 'invalid credentials',
      })

    const payload = {
      id: user.id,
      name: user.name,
      password: user.password,
      role_id: user.role_id,
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err

      res.json({
        msg: 'login successful',
        data: user,
        token,
      })
    })
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      details: err.errors,
    })
  }
}

const register = async (req, res, next) => {
  const { name, password, role_id } = req.body

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const data = await User.create({
      name,
      password: hashedPassword,
      role_id,
    })

    res.status(201).json({
      msg: 'register successful',
      data,
    })
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
      details: err.errors,
    })
  }
}

module.exports = {
  getAll,
  login,
  register,
}
