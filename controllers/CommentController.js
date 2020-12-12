const { Comment, User, Timeline } = require('../models')

class CommentController {
  static async find(req, res, next) {
    try {
      const comment = await Comment.findAll({
        include: [User, Timeline]
      })
      res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
  }

  static async findById(req, res, next) {
    const id = req.params.id
    try {
      const comment = await Comment.findByPk(id)
      if (!comment) {
        throw {msg: 'Comment not found', status: 404}
      }
      res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
  }

  static async create(req, res, next) {
    const payload = req.body
    try {
      const comment = await Comment.create(payload)
      res.status(201).json(comment)
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    const id = req.params.id
    const payload = req.body
    try {
      const comment = await Comment.update(payload, {
        where: {
          id
        },
        returning: true
      })
      if (!comment[1].length) {
        throw {msg: 'Comment not found', status: 404}
      }
      res.status(200).json(comment[1][0])
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    const id = req.params.id
    try {
      const comment = await Comment.destroy({
        where: {
          id
        }
      })
      if (!comment) {
        throw {msg: 'Comment not found', status: 404}
      }
      res.status(200).json('Successful deleted comment')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CommentController