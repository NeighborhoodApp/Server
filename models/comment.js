'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Timeline)
      // Comment.belongsTo(models.User)
    }
  };
  Comment.init({
    comment: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter your comment'
        }
      }
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    TimelineId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};