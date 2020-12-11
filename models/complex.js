"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Complex extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Complex.hasMany(models.Fee);
      Complex.hasMany(models.User);
      Complex.belongsTo(models.RealEstate, {
        foreignKey: "RealEstateId",
        targetKey: "id",
      });
    }
  }
  Complex.init(
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
      RealEstateId: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Inactive",
      },
    },
    {
      sequelize,
      modelName: "Complex",
    }
  );
  return Complex;
};
