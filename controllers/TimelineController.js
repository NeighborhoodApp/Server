const { Timeline, User, RealEstate, Comment, Complex } = require('../models')
const { calculateDistance } = require('../helpers/helper')

class TimelineController {
  static async find(req, res, next) {
    const { coordinate } = req.headers
    console.log("coordinate", coordinate);
    try {
      const timeline = await Timeline.findAll({
        include: [
          {
            model: User,
            include: [
              RealEstate, Complex
            ],
          },
          {
            model: Comment,
            order: [['id', 'ASC']]
          }
        ],
        order: [['updatedAt', 'DESC']]
      })
      if (!timeline.length) {
        throw { msg: "Timeline not found", status: 404 };
      }

      const userCoordinat = coordinate.replace(/\s/g, "").split(",");
      const result = calculateDistance(userCoordinat, timeline);
      res.status(200).json(result);
    } catch (error) {
      console.error('Timeline Controller', error.message, error)
      next(error);
    }
  }

  static async findById(req, res, next) {
    const id = req.params.id;
    try {
      const timeline = await Timeline.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Comment,
            include: [
              {
                model: User,
                required: false,
              },
            ],
          },
          User
        ],
        order: [
          [Comment, 'id', 'ASC']
        ]
      });
      if (!timeline) {
        throw { msg: "Timeline not found", status: 404 };
      }
      res.status(200).json(timeline);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const payload = {
      description: req.body.description,
      image: req.body.image,
      privacy: req.body.privacy,
      UserId: req.loggedIn.id,
    };
    try {
      const timeline = await Timeline.create(payload);
      res.status(201).json(timeline);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const id = req.params.id;
    const payload = {
      description: req.body.description,
      image: req.body.image,
      privacy: req.body.privacy,
      UserId: req.loggedIn.id,
    };
    try {
      const timeline = await Timeline.update(payload, {
        where: {
          id,
        },
        returning: true,
      });
      if (!timeline[1].length) {
        throw { msg: "Timeline not found", status: 404 };
      }
      res.status(200).json(timeline[1][0]);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const id = req.params.id;
    try {
      const timeline = await Timeline.destroy({
        where: {
          id,
        },
      });
      if (!timeline) {
        throw { msg: "Timeline not found", status: 404 };
      }
      res.status(200).json("Successful deleted timeline");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TimelineController;
