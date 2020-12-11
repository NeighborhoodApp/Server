'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Fee.belongsTo(models.RealEsate)
      // Fee.belongsTo(models.Complex)
    }
  };
  Fee.init({
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
          msg: 'Please enter valid date'
        },
        notEmpty: {
          msg: 'Please enter event date'
        },
        isValidDate(value) {
          const dateNow = new Date()
          const inputDate = new Date(value)
          if (dateNow.getFullYear() >= inputDate.getFullYear()) {
            if (dateNow.getMonth() > inputDate.getMonth() || dateNow.getDate() > inputDate.getDate()) {
              throw new Error('Date must be greater than today')
            }
          }
        }
      }
    },
    RealEstateId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Pleasse select your real estate'
        },
        isNumeric: {
          msg: 'Please enter valid real estate'
        }
      }
    },
    ComplexId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Pleasse select your complex'
        },
        isNumeric: {
          msg: 'Please enter valid complex'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Fee',
  });
  return Fee;
};