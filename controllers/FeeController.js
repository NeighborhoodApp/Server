const { Fee, RealEstate, Complex } = require('../models')

class FeeController {
  static async find(req, res, next) {
    try {
      const fee = await Fee.findAll({
        include: [RealEstate, Complex]
      })
      if (!fee.length) {
        throw { msg: 'Fee not found', status: 404 }
      }
      res.status(200).json(fee)
    } catch (error) {
      next(error)
    }
  }

  static async findById(req, res, next) {
    const id = req.params.id
    try {
      const fee = await Fee.findByPk(id)
      if (!fee) {
        throw { msg: 'Fee not found', status: 404 }
      }
      res.status(200).json(fee)
    } catch (error) {
      next(error)
    }
  }

  static async create(req, res, next) {

    const payload = {
      name: req.body.name,
      description: req.body.description,
      due_date: req.body.due_date,
      RealEstateId: req.body.RealEstateId,
      ComplexId: req.body.ComplexId,
    }
    try {
      const fee = await Fee.create(payload)
      res.status(201).json(fee)
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    const id = req.params.id

    const payload = {
      name: req.body.name,
      description: req.body.description,
      due_date: req.body.due_date,
      RealEstateId: req.body.RealEstateId,
      ComplexId: req.body.ComplexId,
    }
    try {
      const fee = await Fee.update(payload, {
        where: {
          id
        },
        returning: true
      })
      if (!fee[1].length) {
        throw { msg: 'Fee not found', status: 404 }
      }
      res.status(200).json(fee[1][0])
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    const id = req.params.id
    try {
      const fee = await Fee.destroy({
        where: {
          id
        }
      })
      if (!fee) {
        throw { msg: 'Fee not found', status: 404 }
      }
      res.status(200).json('Successful deleted fees')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = FeeController