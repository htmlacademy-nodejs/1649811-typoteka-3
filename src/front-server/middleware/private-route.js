'use strict';

module.exports = (req, res, next) => {
  const {loggedUser} = res.locals;
  if (!loggedUser) {
    return res.redirect(`/login`);
  }

  return next();
};
