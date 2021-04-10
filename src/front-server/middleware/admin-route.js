'use strict';

const {UserRole, HttpCode} = require(`../const`);

module.exports = (req, res, next) => {
  const {loggedUser} = res.locals;
  if (!loggedUser || loggedUser.role !== UserRole.ADMIN) {
    return res.statusCode(HttpCode.FORBIDDEN);
  }

  return next();
};
