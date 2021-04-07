'use strict';


class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
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
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }
}

module.exports = CommentService;
