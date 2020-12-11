const router = require('express').Router()
const Controller = require('../controllers/TimelineController')

router.get('/', Controller.find)
router.post('/', Controller.create)
router.get('/:id', Controller.findById)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)

module.exports = router