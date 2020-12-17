class ImageController {
  static upload(req, res, next) {
    console.log(req.body.file)
    res.status(201).json(req.body.file)
  }
}

module.exports = ImageController