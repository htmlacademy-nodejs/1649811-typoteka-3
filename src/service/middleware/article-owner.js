'use strict';

const {HttpCode} = require(`../const`);

module.exports = async (req, res, next) => {
  const {article, user} = res.locals;
  if (article.userId !== user.id) {
    return res.sendStatus(HttpCode.FORBIDDEN);
  }

  return next();
};
