const { User, Role, Complex, RealEstate } = require("../models");
const Helper = require("../helpers/helper");

class UserController {
  static async loginCMS(req, res, next) {
    const { email, password } = req.body;
    try {
      if (email === "admin@mail.com" && password === "tetonggo5") {
        const accessToken = Helper.signToken({
          email: email,
        });
        res.status(200).json({
          access_token: accessToken,
          email: email,
        });
      } else {
        throw {
          msg: "Any user besides AppOwner isn't authorized to pass",
          status: 401,
        };
      }
    } catch (err) {
      next(err);
    }
  }

  static async loginClient(req, res, next) {
    const { email, password, expoPushToken } = req.body;
    try {
      const foundUser = await User.findOne({
        include: [RealEstate, Complex],
        where: {
          email: email,
        },
      });

      if (!foundUser) throw { msg: "User not found", status: 404 };

      if (!Helper.comparePassword(password, foundUser.password)) {
        throw { msg: "Wrong password!", status: 401 };
      }
      console.log("expoPushToken", expoPushToken);
      const updateUser = await User.update(
        { expoPushToken },
        {
          where: {
            id: foundUser.id,
          },
        }
      );
      console.log("updateUser", updateUser);

      const accessToken = Helper.signToken({
        id: foundUser.id,
        email: foundUser.email,
        RoleId: foundUser.RoleId,
      });

      let userLogin = {
        ...foundUser.dataValues,
        access_token: accessToken,
      };
      
      if (foundUser.RealEstate) {
        userLogin = {
          ...foundUser.dataValues,
          access_token: accessToken,
          coordinate: foundUser.RealEstate.coordinate,
        };
      }
      delete userLogin.password;
      res.status(200).json(userLogin);
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  }

  static async registerAdmin(req, res, next) {
    const {
      email,
      password,
      fullname,
      address,
      RealEstateId,
      ComplexId,
      status,
    } = req.body;
    const RoleId = 2;
    try {
      const newUser = await User.create({
        email,
        password,
        fullname,
        address,
        RoleId,
        RealEstateId,
        ComplexId,
        status,
      });
      
      await RealEstate.update(
        { status: "Active" },
        {
          where: {
            id: RealEstateId,
          },
        }
      );
      await Complex.update(
        { status: "Active" },
        {
          where: {
            id: ComplexId,
          },
        }
      );
      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (err) {
      next(err);
    }
  }

  static async registerWarga(req, res, next) {
    const { email, password, fullname, address } = req.body;
    const RoleId = 3;
    console.log(email);
    try {
      const newUser = await User.create({
        email,
        password,
        fullname,
        address,
        RoleId,
      });
      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        fullname: newUser.fullname,
        address: newUser.address,
        status: newUser.status,
      });
    } catch (err) {
      console.log(err.stack);
      next(err);
    }
  }

  static async get(req, res, next) {
    try {
      const allUsers = await User.findAll({
        include: [Role, Complex, RealEstate],
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
        include: [Role, Complex, RealEstate],
      });
      if (!foundUser) throw { msg: "User not found", status: 404 };
      res.status(200).json({ foundUser });
    } catch (err) {
      next(err);
    }
  }

  static async patch(req, res, next) {
    console.log("masuk patch");
    const { status } = req.body;
    const userId = +req.params.id;
    try {
      if (!status) throw { msg: "Don't empty the status field", status: 400 };
      else {
        const patchedUser = await User.update(
          { status },
          {
            where: {
              id: userId,
            },
          }
        );
        if (patchedUser[0] === 0) throw { msg: "User not found", status: 404 };
        res.status(200).json({ msg: `User status is successfully updated` });
      }
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    const { fullname, address, RoleId, RealEstateId, ComplexId } = req.body;
    const userId = +req.params.id;
    try {
      const updatedUser = await User.update(
        { fullname, address, RoleId, RealEstateId, ComplexId },
        {
          where: {
            id: userId,
          },
          returning: true,
        }
      );
      if (updatedUser[0] === 0) throw { msg: "User not found", status: 404 };
      const newUser = { ...updatedUser[1][0] };
      delete newUser.dataValues.password;
      console.log(newUser);
      res.status(200).json({
        foundUser: newUser.dataValues,
        msg: `User info is successfully updated`,
      });
    } catch (err) {
      console.log(err.stack);
      next(err);
    }
  }

  static async delete(req, res, next) {
    const userId = +req.params.id;

    try {
      const deletedUser = await User.destroy({ where: { id: userId } });
      if (!deletedUser) throw { msg: "User not found", status: 404 };
      res.status(200).json({ msg: "User is successfully deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async verifyToken(req, res, next) {
    const { expoPushToken } = req.body;
    const userId = +req.params.id;
    console.log("expoPushToken", expoPushToken, "userId", userId);
    try {
      const updatedUser = await User.update(
        { expoPushToken },
        {
          where: {
            id: userId,
          },
          returning: true
        }
      );
      if (updatedUser[0] === 0) throw { msg: "User not found", status: 404 };
      const newUser = { ...updatedUser[1][0] };
      delete newUser.dataValues.password;
      const dataValue = { ...newUser.dataValues };
      if (dataValue.RealEstateId) {
        const realEstate = await RealEstate.findByPk(dataValue.RealEstateId);
        dataValue.coordinate = realEstate.coordinate;
      }
      res.status(200).json({ foundUser: dataValue });
    } catch (err) {
      console.log(err.stack);
      next(err);
    }
  }
}


module.exports = UserController;
