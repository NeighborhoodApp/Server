const { Category } = require('../models')

class CategoryController {
  static async find(req, res, next) {
    try {
      const category = await Category.findAll()
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CategoryController