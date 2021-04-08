'use strict';

const Alias = require(`../model/alias`);
const {QueryTypes} = require(`sequelize`);
const {MOST_POPULAR_LIMIT} = require(`../const`);

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

  async getMostPopular() {
    const sql = `SELECT a.id, substr(a.announce, 0, 100) || '...' as announce, count(c.id) as "commentsCount"
                 FROM articles a
                          LEFT JOIN comments c on a.id = c."articleId"
                 GROUP BY a.id
                 ORDER BY "commentsCount" DESC
                 LIMIT :limit`;

    return await this._sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: {limit: MOST_POPULAR_LIMIT},
    });

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


  async findPreviews(limit, offset) {
    const sql = `SELECT a.id,
                        a.title,
                        a.announce,
                        a.picture,
                        a."createdAt",
                        count(c)                           as "commentsCount",
                        array(SELECT ct.id::text || '__' || ct.title
                              FROM categories ct
                                       LEFT JOIN article_categories ac on ct.id = ac."categoryId"
                              WHERE ac."articleId" = a.id) as categories
                 FROM articles a
                          LEFT JOIN comments c on a.id = c."articleId"
                 GROUP BY a.id, a."createdAt"
                 ORDER BY a."createdAt" DESC
                 LIMIT :limit OFFSET :offset`;

    const articles = await this._sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: {limit, offset},
    });

    const count = await this._sequelize.query(
        `SELECT count(*) as c
         FROM articles`,
        {
          raw: true,
          plain: true,
          type: QueryTypes.SELECT,
        },
    );


    return {count, articles};
  }

  async findPreviewsInCategory(limit, offset, categoryId) {
    const sql = `SELECT a.id,
                        a.title,
                        a.announce,
                        a.picture,
                        a."createdAt",
                        count(c)                           as "commentsCount",
                        array(SELECT ct.id::text || '__' || ct.title
                              FROM categories ct
                                       LEFT JOIN article_categories ac on ct.id = ac."categoryId"
                              WHERE ac."articleId" = a.id) as categories
                 FROM articles a
                          LEFT JOIN comments c on a.id = c."articleId"
                          LEFT JOIN article_categories act ON act."articleId" = a.id
                 WHERE act."categoryId" = :categoryId
                 GROUP BY a.id, a."createdAt"
                 ORDER BY a."createdAt" DESC
                 LIMIT :limit OFFSET :offset`;

    const articles = await this._sequelize.query(sql, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: {limit, offset, categoryId},
    });

    const count = await this._sequelize.query(
        `SELECT count(ac."articleId") as c
         FROM article_categories ac
         WHERE ac."categoryId" = :categoryId`,
        {
          raw: true,
          plain: true,
          type: QueryTypes.SELECT,
          replacements: {categoryId},
        },
    );


    return {count, articles};
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
