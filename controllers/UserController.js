const { User, Role, Complex, RealEstate } = require("../models");
const Helper = require("../helpers/helper");

class UserController {
  static async loginCMS(req, res, next) {
    const { email, password } = req.body;
    try {
      if (email !== "admin@mail.com" && password !== "tetonggo5")
        throw { msg: "User not found", status: 404 };
      else {
        const accessToken = Helper.signToken({
          email: email,
        });
        res.status(200).json({
          access_token: accessToken,
          email: email,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async loginWarga(req, res, next) {
    const { email, password } = req.body;
    try {
      const foundUser = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!foundUser) throw { msg: "User not found", status: 404 };
      else if (!Helper.comparePassword(password, foundUser.password))
        throw { msg: "Wrong password!", status: 401 };
      else {
        const accessToken = Helper.signToken({
          id: foundUser.id,
          email: foundUser.email,
          RoleId: foundUser.RoleId,
        });
        res.status(200).json({
          access_token: accessToken,
          id: foundUser.id,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async registerWarga(req, res, next) {
    const {
      email,
      password,
      fullname,
      address,
      RoleId,
      RealEstateId,
      ComplexId,
    } = req.body;

    try {
      const newUser = await User.create({
        email,
        password,
        fullname,
        address,
        RoleId,
        RealEstateId,
        ComplexId,
      });
      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (err) {
      next(err);
    }
  }

  static async get(req, res, next) {
    try {
      const allUsers = await User.findAll({
        include: [
          { model: Role },
          {
            model: Complex,
          },
          {
            model: RealEstate,
          },
        ],
        order: [["id", "ASC"]],
      });
      res.status(200).json({ allUsers });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    const userId = +req.params.id;

    try {
      const foundUser = await User.findOne({
        where: {
          id: userId,
        },
        include: [
          {
            model: Role,
          },
          {
            model: Complex,
          },
          {
            model: RealEstate,
          },
        ],
      });
      res.status(200).json({ foundUser });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    const { fullname, address, RoleId, RealEstateId, ComplexId } = req.body;
    const userId = +req.params.id;

    try {
      await User.update(
        { fullname, address, RoleId, RealEstateId, ComplexId },
        {
          where: {
            id: userId,
          },
        }
      );
      res.status(200).json({ msg: `User info is successfully updated` });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    const userId = +req.params.id;

    try {
      await User.destroy({ where: { id: userId } });
      res.status(200).json({ msg: "User is successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
