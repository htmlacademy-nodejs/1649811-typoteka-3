'use strict';

const Alias = require(`../model/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments = false) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    return await this._Article.findAll({include});
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
      const articleModel = await this._Article.findByPk(id);

      await articleModel.update(article);

      await articleModel.setCategories(article.categories);

      return true;

    } catch (err) {

      return false;
    }
  }
}

module.exports = ArticleService;
