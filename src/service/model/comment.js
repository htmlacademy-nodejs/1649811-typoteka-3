'use strict';

const Alias = require(`./alias`);
const {Model, DataTypes} = require(`sequelize`);

class Comment extends Model {
}

const define = (sequelize) => {

  Comment.init({
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: Alias.COMMENTS,
    updatedAt: false,
  });

  return Comment;
};

module.exports = define;
