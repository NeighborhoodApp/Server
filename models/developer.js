"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Developer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Developer.hasMany(models.RealEstate);
      Developer.belongsTo(models.Role, {
        foreignKey: "RoleId",
        targetKey: "id",
      });
    }
  }
  Developer.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Fill the name field",
          },
        },
      },
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
            Developer.findOne({ where: { email: value } }).then((data) => {
              if (!data) next();
              else {
                next("Email already registered");
              }
            });
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Fill the address field",
          },
        },
      },
      RoleId: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Active",
      },
    },
    {
      sequelize,
      modelName: "Developer",
    }
  );
  return Developer;
};
