'use strict';

const {QueryTypes} = require(`sequelize`);


class CategoryService {
  constructor(sequelize) {
    this._sequelize = sequelize;
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

  async findAll() {
    const sql = `
      SELECT c.id, c.title, COUNT(ac."articleId") as count
      FROM categories c
             LEFT JOIN article_categories ac ON ac."categoryId" = c.id
      GROUP BY c.id;
    `;

    return await this._sequelize.query(sql, {type: QueryTypes.SELECT});
  }

  async findByArticle(articleId) {
    const sql = `
      SELECT c.id, c.title, (SELECT COUNT(s."articleId") FROM article_categories s WHERE s."categoryId" = c.id) as "count"
      FROM categories c
             LEFT JOIN article_categories ac on c.id = ac."categoryId"
      WHERE ac."articleId" = :articleId
      GROUP BY c.id, c.title ORDER BY c.title;
    `;

    return await this._sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: {articleId}
    });
  }

  async findAllOnlyHavingArticles() {
    const sql = `
      SELECT c.id, c.title, COUNT(ac."articleId") as "count"
      FROM article_categories ac
             LEFT JOIN categories c ON ac."categoryId" = c.id
      GROUP BY c.id, c.title ORDER BY c.title;
    `;

    return await this._sequelize.query(sql, {type: QueryTypes.SELECT});
  }

  async drop(id) {
    try {
      await this._Category.destroy({
        where: {id},
      });

      return true;
    } catch (err) {
      return false;
    }
  }

}

module.exports = CategoryService;
