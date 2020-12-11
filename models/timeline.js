'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Timeline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Timeline.hasMany(models.Comment)
      // Timeline.belongsTo(models.User)
    }
  };
  Timeline.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter timeline description'
        }
      }
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING
    },
    privacy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter timeline privacy'
        },
        isIn: {
          args: [['public', 'member']],
          msg: 'Must be public or member'
        }
      }
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Timeline',
  });
  return Timeline;
};