'use strict';

const {Sequelize} = require(`sequelize`);
const Alias = require(`../model/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(categoryData) {
    return this._Category.create(categoryData);
  }

  async update(id, category) {
    try {
      await this._Category.update(category, {
        where: {id},
      });
    } catch (err) {
      return false;
    }

    return true;
  }

  async findOne(id) {
    return await this._Category.findByPk(id);
  }

  async findAll(needCount = false) {
    if (needCount) {
      return await this._Category.findAll({
        attributes: [
          `id`,
          `title`,
          [
            Sequelize.fn(`COUNT`, `*`),
            `count`,
          ],
        ],
        group: [Sequelize.col(`id`)],
        include: [{
          model: this._ArticleCategory,
          as: Alias.CATEGORY_ARTICLES,
          attributes: [],
        }],
      });
    }

    return await this._Category.findAll({raw: true});
  }

  async drop(id) {
    try {
      await this._Category.destroy({
        where: {id},
      });

      return true;

    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

}

module.exports = CategoryService;
