const { Event, Category, User, RealEstate } = require("../models");

class EventController {
  static async find(req, res, next) {
    try {
      const event = await Event.findAll({
        include: [Category, User, RealEstate],
      });
      if (!event.length) {
        throw { msg: "Event not found", status: 404 };
      }
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    const id = req.params.id;
    try {
      const event = await Event.findOne({
        where: {
          id
        },
        include: [Category, User, RealEstate]
      });
      if (!event) {
        throw { msg: "Event not found", status: 404 };
      }
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const { name, description, image, date, CategoryId } = req.body;
    const payload = { name, description, image, date, CategoryId,
      RealEstateId: req.loggedIn.RealEstateId,
      UserId: req.loggedIn.id,
    };
    try {
      const event = await Event.create(payload);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const id = req.params.id;
    const payload = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      date: req.body.date,
      CategoryId: req.body.CategoryId,
      RealEstateId: req.body.RealEstateId,
      UserId: req.loggedIn.id,
    };
    try {
      const event = await Event.update(payload, {
        where: {
          id,
        },
        returning: true,
      });
      if (!event[1].length) {
        throw { msg: "Event not found", status: 404 };
      }
      res.status(200).json(event[1][0]);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const id = req.params.id;
    try {
      const event = await Event.destroy({
        where: {
          id,
        },
      });
      if (!event) {
        throw { msg: "Event not found", status: 404 };
      }
      res.status(200).json("Successful deleted event");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EventController;
