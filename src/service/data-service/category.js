'use strict';

const {QueryTypes} = require(`sequelize`);

class CategoryService {
  constructor(sequelize) {
    this._sequelize = sequelize;
  }

  async findAll(needCount = false) {
    if (needCount) {
      const $sql = `SELECT c.id, c.title, COUNT(ac."articleId") as count
                    FROM categories c
                        LEFT JOIN articles_categories ac ON ac."categoryId" = c.id
                    GROUP BY c.id, ac."articleId"`;

      return await this._sequelize.query($sql, {
        type: QueryTypes.SELECT
      });
    }

    return await this._sequelize.models.Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
