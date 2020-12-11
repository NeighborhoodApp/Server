const { RealEstate, Developer } = require("../models");

class RealEstateController {
  static async get(req, res, next) {
    try {
      const allRealEstates = await RealEstate.findAll({
        include: [{ model: Developer }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({ allRealEstates });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    const { name, address, coordinate, DeveloperId, status } = req.body;
    try {
      await RealEstate.create({
        name,
        address,
        coordinate,
        DeveloperId,
        status,
      });
      res.status(201).json({ msg: "A new RealEstate successfully added" });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    const realEstateId = +req.params.id;

    try {
      const foundRealEstate = await RealEstate.findOne({
        where: {
          id: realEstateId,
        },
        include: {
          model: Developer,
        },
      });
      res.status(200).json({ foundRealEstate });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    const { name, address, coordinate, DeveloperId, status } = req.body;
    const realEstateId = +req.params.id;

    try {
      await RealEstate.update(
        { name, address, coordinate, DeveloperId, status },
        {
          where: {
            id: realEstateId,
          },
        }
      );
      res.status(200).json({ msg: `RealEstate info is successfully updated` });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    const realEstateId = +req.params.id;

    try {
      await RealEstate.destroy({ where: { id: realEstateId } });
      res.status(200).json({ msg: "RealEstate is successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RealEstateController;
