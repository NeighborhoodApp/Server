const router = require('express').Router()
const Controller = require('../controllers/CategoryController')

router.get('/', Controller.find)

module.exports = router