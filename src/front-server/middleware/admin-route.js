'use strict';

const {UserRole, HttpCode} = require(`../const`);

module.exports = (req, res, next) => {
  const {loggedUser} = res.locals;
  if (!loggedUser || loggedUser.role !== UserRole.ADMIN) {
    return res.status(HttpCode.FORBIDDEN).render(`errors/403`);
  }

  return next();
};
