'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Category)
      // Event.belongsTo(models.User)
      // Event.belongsTo(models.RealEstate)
    }
  };
  Event.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter event name'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter event description'
        }
      }
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        isDate: {
          args: 'Please enter valid date'
        },
        notEmpty: {
          args: 'Please enter event date'
        }
      }
    },
    CategoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: 'Pleasse select event category'
        },
        isNumeric: {
          args: 'Please enter valid category'
        }
      }
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
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
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};