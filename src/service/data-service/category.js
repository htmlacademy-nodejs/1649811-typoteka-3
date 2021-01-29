'use strict';

const {QueryTypes} = require(`sequelize`);

class CategoryService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Category = sequelize.models.Category;
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
      // console.log(err);

      return false;
    }

    return true;
  }

  async findAll(needCount = false) {
    if (needCount) {
      const $sql = `SELECT c.id, c.title, COUNT(ac."articleId") as count
                    FROM categories c
                           LEFT JOIN articles_categories ac ON ac."categoryId" = c.id
                    GROUP BY c.id`;

      return await this._sequelize.query($sql, {
        type: QueryTypes.SELECT,
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
