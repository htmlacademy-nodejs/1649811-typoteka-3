'use strict';

const {Op} = require(`sequelize`);
const Alias = require(`../model/alias`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {

    return await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText,
        },
      },
      include: Alias.CATEGORIES,
    });

  }
}

module.exports = SearchService;
