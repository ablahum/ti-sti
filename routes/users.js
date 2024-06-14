var express = require('express')
var router = express.Router()
const { getAll, login, register } = require('../controllers/UserController')

router.get('/', getAll)
router.post('/login', login)
router.post('/register', register)

module.exports = router
