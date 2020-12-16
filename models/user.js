"use strict";
const { Model } = require("sequelize");
const Helper = require("../helpers/helper");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Event);
      User.hasMany(models.Timeline);
      User.hasMany(models.Comment);
      User.belongsTo(models.Role, {
        foreignKey: "RoleId",
        targetKey: "id",
      });
      User.belongsTo(models.RealEstate, {
        foreignKey: "RealEstateId",
        targetKey: "id",
      });
      User.belongsTo(models.Complex, {
        foreignKey: "ComplexId",
        targetKey: "id",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Don't put empty email",
          },
          isEmail: {
            args: true,
            msg: "Put a valid email address",
          },
          isUniqueEmail(value, next) {
            User.findOne({ where: { email: value } }).then((data) => {
              if (!data) next();
              else {
                next("Email already registered");
              }
            });
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Please fill the password",
          },
          isPassword(value, next) {
            let isContainNumber = false;
            let numbers = "123456789".split("");
            value.split("").forEach((eachValue) => {
              numbers.forEach((eachNumber) => {
                if (eachValue === eachNumber) {
                  isContainNumber = true;
                }
              });
            });
            if (!isContainNumber) next("Password must include number!");
            else {
              next();
            }
          },
        },
      },
      fullname: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Please fill the fullname field",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Please fill the address field",
          },
        },
      },
      RoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      RealEstateId: DataTypes.INTEGER,
      ComplexId: DataTypes.INTEGER,
      expoPushToken: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Inactive",
      },
    },
    {
      hooks: {
        beforeCreate(instance, options) {
          instance.password = Helper.hashPassword(instance.password);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
