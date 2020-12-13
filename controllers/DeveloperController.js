const { Developer, Role, RealEstate } = require("../models");

class DeveloperController {
  static async get(req, res, next) {
    try {
      const allDevelopers = await Developer.findAll({
        include: [Role],
        order: [["id", "ASC"]],
      });
      res.status(200).json({ allDevelopers });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    const { name, email, address, status } = req.body;
    const RoleId = 1;
    try {
      await Developer.create({
        name,
        email,
        address,
        RoleId,
        status,
      });
      res.status(201).json({ msg: "A new Developer successfully added" });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    const developerId = +req.params.id;

    try {
      const foundDeveloper = await Developer.findOne({
        where: {
          id: developerId,
        },
        include: [Role, RealEstate],
      });
      if (!foundDeveloper) throw { msg: "Developer not found", status: 404 };

      res.status(200).json({ foundDeveloper });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    const { name, address, status } = req.body;
    const developerId = +req.params.id;

    try {
      const updatedDeveloper = await Developer.update(
        { name, address, status },
        {
          where: {
            id: developerId,
          },
        }
      );
      if (updatedDeveloper[0] === 0)
        throw { msg: "Developer not found", status: 404 };
      res.status(200).json({ msg: `Developer info is successfully updated` });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    const developerId = +req.params.id;

    try {
      await Developer.destroy({
        where: { id: developerId },
      });
      res.status(200).json({ msg: "Developer is successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DeveloperController;
