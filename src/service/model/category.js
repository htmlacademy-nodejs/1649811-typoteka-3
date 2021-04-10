'use strict';

const Alias = require(`./alias`);
const {Model, DataTypes} = require(`sequelize`);
const typeString = DataTypes.STRING;

class Category extends Model {
}

const define = (sequelize) => {

  Category.init({
    title: {
      type: typeString(30),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: `Category`,
    tableName: Alias.CATEGORIES,
    timestamps: false,
  });

  return Category;
};

module.exports = define;
