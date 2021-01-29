'use strict';

const Alias = require(`./alias`);
const {Model, DataTypes} = require(`sequelize`);

class Article extends Model {
}

const define = (sequelize) => {

  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    announce: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [30, 250],
      },
    },
    fullText: {
      type: DataTypes.TEXT,
      defaultValue: null,
      validate: {
        max: 1000,
      },
    },
  }, {
    sequelize,
    modelName: `Article`,
    tableName: Alias.ARTICLES,
  });

  return Article;
};

module.exports = define;
