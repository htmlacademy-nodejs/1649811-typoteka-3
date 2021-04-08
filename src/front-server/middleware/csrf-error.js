'use strict';

const {HttpCode} = require(`../const`);

module.exports = (err, req, res, next) => {
  if (err && err.code === `EBADCSRFTOKEN`) {
    return res.status(HttpCode.FORBIDDEN).render(`errors/403`);
  } else if (err) {
    throw err;
  }

  return next();
};
