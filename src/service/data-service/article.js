'use strict';

const Alias = require(`../model/alias`);
const {QueryTypes, Op} = require(`sequelize`);
const {MOST_POPULAR_LIMIT} = require(`../const`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
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

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return !!deletedRows;
  }

  async findOne(id, needComments = false) {

    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [Alias.USER],
        separate: true,
        order: [[`createdAt`, `desc`]],
      });
    }

    return await this._Article.findByPk(id, {include});
  }

  async findAll() {
    const articles = await this._Article.findAll({
      include: [Alias.CATEGORIES],
      order: [[`createdAt`, `DESC`]],
    });
    return {articles};
  }

  async findPage({limit, offset, categoryId = null}) {

    const include = [Alias.CATEGORIES];

    const attributes = [
      `id`, `title`, `announce`, `picture`, `createdAt`,
      [
        this._sequelize.literal(
            `(SELECT COUNT(*) FROM comments c where c."articleId" = "Article".id)`),
        `commentsCount`,
      ],
    ];

    let count;

    if (categoryId) {
      include.push({
        model: this._ArticleCategory,
        as: Alias.ARTICLE_CATEGORIES,
        where: {"categoryId": {[Op.eq]: categoryId}},
        right: true,
        attributes: [],
      });

      count = await this._ArticleCategory.count({where: {categoryId}});
    } else {
      count = await this._Article.count();
    }

    const articles = await this._Article.findAll({
      include,
      attributes,
      limit,
      offset,
      order: [[`createdAt`, `DESC`]],
    });

    return {count, articles};
  }

  async findMostPopular() {
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
}

module.exports = ArticleService;
