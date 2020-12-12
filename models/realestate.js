"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RealEstate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RealEstate.hasMany(models.Event);
      RealEstate.hasMany(models.Fee);
      RealEstate.hasMany(models.Complex);
      RealEstate.hasMany(models.User);
      RealEstate.belongsTo(models.Developer, {
        foreignKey: "DeveloperId",
        targetKey: "id",
      });
    }
  }
  RealEstate.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Don't empty the name field",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Don't empty the address field",
          },
        },
      },
      coordinate: {
        type: DataTypes.STRING,
      },
      DeveloperId: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Inactive",
      },
    },
    {
      sequelize,
      modelName: "RealEstate",
    }
  );
  return RealEstate;
};
