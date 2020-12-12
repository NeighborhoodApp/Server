const router = require('express').Router()
const upload = require('../middlewares/upload')
const Controller = require('../controllers/ImageController')

router.post('/', upload.single('file'), Controller.upload)

module.exports = router