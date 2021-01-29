'use strict';

const Alias = require(`../model/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return !!deletedRows;
  }

  async findAll(needComments = false, userId = false) {
    const include = [Alias.CATEGORIES];
    let where = null;

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        order: [
          [`createdAt`, `DESC`],
        ],
      });
    }

    if (userId) {
      where = {userId};
    }

    return await this._Article.findAll({
      include,
      where,
      order: [
        [`createdAt`, `DESC`],
      ],
    });
  }

  async findAllByCategory(id) {
    return await this._Category.findByPk(id, {
      include: {
        model: this._Article,
        as: Alias.ARTICLES,
        order: [
          [`createdAt`, `DESC`],
        ],
        include: [Alias.CATEGORIES, Alias.COMMENTS],
      },
    });
  }

  async findOne(id, needComments = false) {
    const include = [Alias.CATEGORIES];

    // const include = [{
    //   model: this._Category,
    //   as: Alias.CATEGORIES,
    //   include: [Alias.ARTICLES]
    // }];

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
      // console.log(err);

      return false;
    }
  }
}

module.exports = ArticleService;
