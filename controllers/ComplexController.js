const { Complex, RealEstate } = require("../models");

class ComplexController {
  static async get(req, res, next) {
    try {
      const allComplexes = await Complex.findAll({
        include: [{ model: RealEstate }],
        order: [["id", "ASC"]],
      });
      res.status(200).json({ allComplexes });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    const { name, RealEstateId, status } = req.body;
    try {
      await Complex.create({
        name,
        RealEstateId,
        status,
      });
      res.status(201).json({ msg: "A new Complex successfully added" });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    const complexId = +req.params.id;

    try {
      const foundComplex = await Complex.findOne({
        where: {
          id: complexId,
        },
        include: {
          model: RealEstate,
        },
      });
      res.status(200).json({ foundComplex });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    const { name, RealEstateId, status } = req.body;
    const complexId = +req.params.id;

    try {
      await Complex.update(
        { name, RealEstateId, status },
        {
          where: {
            id: complexId,
          },
        }
      );
      res.status(200).json({ msg: `Complex info is successfully updated` });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    const complexId = +req.params.id;

    try {
      await Complex.destroy({ where: { id: complexId } });
      res.status(200).json({ msg: "Complex is successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ComplexController;
