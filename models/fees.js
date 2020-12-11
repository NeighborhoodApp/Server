'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Fees.belongsTo(models.RealEsate)
      // Fees.belongsTo(models.Complex)
    }
  };
  Fees.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter fees name'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter fees description'
        }
      }
    },
    due_date: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        isDate: {
          args: 'Please enter valid date'
        },
        notEmpty: {
          args: 'Please enter fees date'
        }
      }
    },
    RealEstateId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: 'Pleasse select your real estate'
        },
        isNumeric: {
          args: 'Please enter valid real estate'
        }
      }
    },
    ComplexId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: 'Pleasse select your complex'
        },
        isNumeric: {
          args: 'Please enter valid complex'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Fees',
  });
  return Fees;
};