const { Event } = require('../models')

class EventController {
  static async find(req, res, next) {
    try {
      const event = await Event.findAll()
      res.status(200).json(event)
    } catch (error) {
      console.log(error)
    }
  }

  static async findById(req, res, next) {
    const id = req.params.id
    try {
      const event = await Event.findByPk(id)
      if (!event) {
        throw {msg: 'Event not found', status: 404}
      }
      res.status(200).json(event)
    } catch (error) {
      console.log(error.msg)
    }
  }

  static async create(req, res, next) {
    const payload = req.body
    try {
      const event = await Event.create(payload)
      res.status(201).json(event)
    } catch (error) {
      console.log(error)
    }
  }

  static async update(req, res, next) {
    const id = req.params.id
    const payload = req.body
    try {
      const event = await Event.update(payload, {
        where: {
          id
        },
        returning: true
      })
      if (!event[1].length) {
        throw {msg: 'Event not found', status: 404}
      }
      res.status(200).json(event[1][0])
    } catch (error) {
      console.log(error.msg)
    }
  }

  static async delete(req, res, next) {
    const id = req.params.id
    try {
      const event = await Event.destroy({
        where: {
          id
        }
      })
      if (!event) {
        throw {msg: 'Event not found', status: 404}
      }
      res.status(200).json('Successful deleted event')
    } catch (error) {
      console.log(error.msg)
    }
  }
}

module.exports = EventController