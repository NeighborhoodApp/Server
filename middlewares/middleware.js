const Helper = require("../helpers/helper");
const {
  User,
  Comment,
  Developer,
  RealEstate,
  Role,
  Complex,
  Event,
  Fee,
  Timeline,
} = require("../models");

class Middleware {
  static async ownerAuth(req, res, next) {
    const { access_token } = req.headers;
    try {
      if (!access_token) throw { msg: "Authentication failed", status: 401 };
      else {
        const decoded = await Helper.verifyToken(access_token);
        if (decoded.email !== "admin@mail.com")
          throw { msg: "Authentication failed", status: 401 };
        else {
          req.loggedIn = decoded;
          next();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async adminAuth(req, res, next) {
    const { access_token } = req.headers;
    try {
      if (!access_token) throw { msg: "Authentication failed", status: 401 };
      else {
        const decoded = await Helper.verifyToken(access_token);
        const loggedUser = await User.findOne({
          where: {
            email: decoded.email,
          },
        });
        if (!loggedUser) throw { msg: "Authentication failed", status: 401 };
        else if (loggedUser.RoleId !== 2)
          throw { msg: "Authentication failed", status: 401 };
        else {
          req.loggedIn = decoded;
          next();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async wargaAuth(req, res, next) {
    const { access_token } = req.headers;
    try {
      if (!access_token) throw { msg: "Authentication failed", status: 401 };
      else {
        const decoded = await Helper.verifyToken(access_token);
        const loggedUser = await User.findOne({
          where: {
            email: decoded.email,
          },
        });
        if (!loggedUser) throw { msg: "Authentication failed", status: 401 };
        else if (loggedUser.RoleId !== 3 && loggedUser.RoleId !== 2)
          throw { msg: "Authentication failed", status: 401 };
        else {
          req.loggedIn = decoded;
          next();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async commentAuthorization(req, res, next) {
    const commentId = +req.params.id;
    try {
      const foundComment = await Comment.findByPk(commentId);
      if (!foundComment) next();
      else if (foundComment.UserId == req.loggedIn.id) next();
      else throw { msg: "Not authorized", status: 401 };
    } catch (err) {
      next(err);
    }
  }

  static async eventAuthorization(req, res, next) {
    const eventId = +req.params.id;
    try {
      const foundEvent = await Event.findByPk(eventId);
      if (!foundEvent) next();
      else if (foundEvent.UserId == req.loggedIn.id) next();
      else throw { msg: "Not authorized", status: 401 };
    } catch (err) {
      next(err);
    }
  }

  static async timelineAuthorization(req, res, next) {
    const timelineId = +req.params.id;
    try {
      const foundTimeline = await Timeline.findByPk(timelineId);
      if (!foundTimeline) next();
      else if (foundTimeline.UserId == req.loggedIn.id) next();
      else throw { msg: "Not authorized", status: 401 };
    } catch (err) {
      next(err);
    }
  }

  static async feeAuthorization(req, res, next) {
    const feeId = +req.params.id;
    console.log(req.params.id, 'feeeeeeeeeeeeeeeeeeeeee')
    try {
      const foundFee = await Fee.findByPk(feeId);
      if (!foundFee) next();
      else if (
        req.loggedIn.RoleId !== 3 &&
        foundFee.RealEstateId === +req.headers.realestateid &&
        foundFee.ComplexId === +req.headers.complexid
      )
        next();
      else throw { msg: "Not authorized", status: 401 };
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async createFeeAuthorization(req, res, next) {
    try {
      if (req.loggedIn.RoleId !== 3) next();
      else throw { msg: "Not authorized", status: 401 };
    } catch (err) {
      next(err);
    }
  }

  static async deleteDeveloperVerification(req, res, next) {
    const developerId = +req.params.id;
    try {
      const foundDeveloper = await Developer.findOne({
        where: {
          id: developerId,
        },
        include: [RealEstate],
      });
      if (!foundDeveloper) next();
      else if (foundDeveloper.RealEstates.length > 0)
        throw {
          msg:
            "Can't delete, this Developer still has some dependent Real Estates in the registry",
          status: 401,
        };
      else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteRealEstateVerification(req, res, next) {
    const realEstateId = +req.params.id;
    try {
      const foundRealEstate = await RealEstate.findOne({
        where: {
          id: realEstateId,
        },
        include: [Complex],
      });
      if (!foundRealEstate) next();
      else if (foundRealEstate.Complexes.length > 0)
        throw {
          msg:
            "Can't delete, dependent Complexes are found in this RealEstate registry",
          status: 401,
        };
      else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteComplexVerification(req, res, next) {
    const complexId = +req.params.id;
    try {
      const foundComplex = await Complex.findOne({
        where: {
          id: complexId,
        },
        include: [User],
      });
      if (!foundComplex) next();
      else if (foundComplex.Users.length > 0)
        throw {
          msg: "Can't delete, some Users are still registered in this area",
          status: 401,
        };
      else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
  static async deleteAdminVerification(req, res, next) {
    const userId = +req.params.id;
    try {
      const foundUser = await User.findOne({
        where: {
          id: userId,
        },
        include: [Role],
      });
      if (!foundUser) throw { msg: "User not found", status: 404 };
      else if (foundUser.RoleId !== 2) next();
      else if (foundUser.RoleId === 2) {
        const allUsersAsAdmin = await User.findAll({
          where: {
            RoleId: 2,
          },
        });
        if (allUsersAsAdmin.length > 1) next();
        else {
          throw {
            msg:
              "Can't proceed to delete, this user is the only admin right now",
            status: 401,
          };
        }
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }

  static adminRegistrationInputValidation(req, res, next) {
    const { RealEstateId, ComplexId } = req.body;
    if (!RealEstateId && !ComplexId)
      throw {
        msg: "Please fill the Real Estate field and Complex field",
        status: 400,
      };
    else if (!RealEstateId)
      throw { msg: "Please fill the Real Estate field", status: 400 };
    else if (!ComplexId)
      throw { msg: "Please fill the Complex field", status: 400 };
    else next();
  }

  static errorHandler(err, req, res, next) {
    console.log(err.stack);
    let status = err.status || 500;
    let msg = err.msg || "Internal Server Error";

    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      status = 400;
      msg = err.errors.map((el) => el.message).join(", ");
    }
    res.status(status).json({ msg });
  }
}

module.exports = Middleware;
