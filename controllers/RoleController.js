const { Role } = require("../models");

class RoleController {
  static async get(req, res, next) {
    try {
      const allRoles = await Role.findAll();
      res.status(200).json({ allRoles });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    const { role } = req.body;
    try {
      await Role.create({
        role,
      });
      res.status(201).json({ msg: "A new Role successfully added" });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const roleId = +req.params.id;
      const foundRole = await Role.findOne({
        where: {
          id: roleId,
        },
      });
      if (!foundRole) throw { msg: "Role not found", status: 404 };
      res.status(200).json({ foundRole });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    const { role } = req.body;
    const roleId = +req.params.id;

    try {
      const updatedRole = await Role.update(
        { role },
        {
          where: {
            id: roleId,
          },
        }
      );
      if (updatedRole[0] === 0) throw { msg: "Role not found", status: 404 };
      res.status(200).json({ msg: `Role name is successfully updated` });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    const roleId = +req.params.id;

    try {
      const deletedRole = await Role.destroy({ where: { id: roleId } });
      if (!deletedRole) throw { msg: "Role not found", status: 404 };
      res.status(200).json({ msg: "Role is successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RoleController;
