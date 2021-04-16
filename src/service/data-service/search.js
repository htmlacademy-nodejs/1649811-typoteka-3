'use strict';

const {Op} = require(`sequelize`);
const Alias = require(`../model/alias`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._sequelize = sequelize;
  }

  async findAll(searchText) {
    return await this._Article.findAll({
      where: this._sequelize
        .where(
            this._sequelize.fn(`lower`, this._sequelize.col(`Article.title`)),
            {
              [Op.like]: `%${searchText.toLowerCase()}%`,
            },
        ),
      include: Alias.CATEGORIES,
      order: [[`createdAt`, `DESC`]],
    });
  }
}

module.exports = SearchService;
