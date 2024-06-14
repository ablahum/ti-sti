var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const sequelize = require('./db')

const userRoutes = require('./routes/users')
const orderRoutes = require('./routes/orders')
const tripRoutes = require('./routes/trips')

var app = express()

sequelize.sync()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', userRoutes)
app.use('/orders', orderRoutes)
app.use('/trips', tripRoutes)

module.exports = app
