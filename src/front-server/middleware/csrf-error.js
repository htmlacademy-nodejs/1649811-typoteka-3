'use strict';

const {HttpCode} = require(`../const`);

module.exports = (err, req, res, next) => {
  if (err.code === `EBADCSRFTOKEN`) {
    return res.status(HttpCode.FORBIDDEN).render(`errors/403`);
  }

  return next();
};
