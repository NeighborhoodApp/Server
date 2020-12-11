const router = require('express').Router()
const category = require('./category')
const event = require('./event')
const fee = require('./fee')
const timeline = require('./timeline')
const comment = require('./comment')

router.use('/category', category)
router.use('/event', event)
router.use('/fee', fee)
router.use('/timeline', timeline)
router.use('/comment', comment)

module.exports = router