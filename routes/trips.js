var express = require('express')
var router = express.Router()
const auth = require('../middleware')
const { getAll } = require('../controllers/TripController')

router.get('/', auth, getAll)

module.exports = router
