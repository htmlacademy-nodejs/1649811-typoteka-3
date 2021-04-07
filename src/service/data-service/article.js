'use strict';

const Alias = require(`../model/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;

    this._sequelize = sequelize;
  }

  async create(articleData, userId) {
    const article = await this._Article.create({
      ...articleData,
      userId,
    });
    await article.addCategories(articleData.categories);

    return article;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return !!deletedRows;
  }

  async findAll({userId, comments}) {

    const include = [Alias.CATEGORIES];

    if (comments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        order: [
          [`createdAt`, `DESC`],
        ],
      });
    }

    const where = (userId) ? {userId} : null;

    return await this._Article.findAll({
      include,
      where,
      order: [
        [`createdAt`, `DESC`],
      ],
    });
  }

  async findPage({limit, offset, userId, comments}) {

    const include = [Alias.CATEGORIES];

    if (comments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
      });
    }

    const where = (userId) ? {userId} : null;

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      where,
      order: [
        [`createdAt`, `DESC`],
      ],
      distinct: true,

    });

    return {count, articles: rows};
  }


  async findAllByCategory(categoryId, {limit, offset}) {

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Alias.CATEGORIES,
        {
          model: this._ArticleCategory,
          as: Alias.ARTICLE_CATEGORIES,
          attributes: [],
          where: {categoryId},
        },
        Alias.COMMENTS,
      ],
      order: [
        [`createdAt`, `DESC`],
      ],
      distinct: true,
    });

    return {count, articles: rows};
  }

  async findOne(id, needComments = false) {

    const include = [Alias.CATEGORIES];

    if (needComments) {

      const comments = {
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [Alias.USER],
      };

      include.push(comments);
    }

    return await this._Article.findByPk(id, {include});
  }

  async update(id, article) {

    try {
      await this._Article.update(article, {
        where: {id},
      });

      const artModel = await this._Article.findByPk(id);
      artModel.setCategories(article.categories);

      return true;

    } catch (err) {
      return false;
    }
  }
}

module.exports = ArticleService;
