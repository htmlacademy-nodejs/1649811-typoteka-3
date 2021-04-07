'use strict';

const {HttpCode} = require(`../const`);

module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;
  const {comments} = req.query;
  const article = await service.findOne(articleId, comments);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
  }

  res.locals.article = article;
  res.locals.articleId = articleId;

  return next();
};
