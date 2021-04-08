'use strict';

const {QueryTypes} = require(`sequelize`);
const {LAST_COMMENTS_LIMIT} = require(`../const`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._sequelize = sequelize;
  }

  async create(articleId, userId, comment) {
    return await this._Comment.create({
      ...comment,
      articleId,
      userId,
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id},
    });

    return !!deletedRows;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true,
    });
  }

  async getLastComments() {
    const sql = `SELECT substr(c.text, 0, 100) || '...'  as text,
                        c."articleId",
                        u.avatar                         as "userAvatar",
                        u.firstname || ' ' || u.lastname as username
                 FROM comments c
                          LEFT JOIN users u on c."userId" = u.id
                 ORDER BY c."createdAt" DESC
                 LIMIT :limit`;

    return await this._sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: {limit: LAST_COMMENTS_LIMIT},
    });
  }
}

module.exports = CommentService;
