'use strict';

const {HttpCode, UserRole} = require(`../const`);

module.exports = async (req, res, next) => {
  const {user} = res.locals;
  if (user.role !== UserRole.ADMIN) {
    return res.sendStatus(HttpCode.FORBIDDEN);
  }

  return next();
};
