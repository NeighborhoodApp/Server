const { Category, Event } = require('../models')

class CategoryController {
  static async find(req, res, next) {
    try {
      const category = await Category.findAll({
        include: [Event]
      })
      if (!category.length) {
        throw {msg: 'Category not found', status: 404}
      }
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CategoryController