class ImageController {
  static upload(req, res, next) {
    res.status(201).json(req.body.file)
  }
}

module.exports = ImageController