'use strict';

const {HttpCode} = require(`../const`);
const {LoginMessage} = require(`../const-messages`);

module.exports = (service) => async (req, res, next) => {
  const {email, password} = req.body;

  const user = await service.findByEmail(email);
  if (!user) {
    return res.status(HttpCode.NOT_FOUND)
						.json({errors: {email: LoginMessage.USER_NOT_EXISTS}});
  }

  if (!await service.checkAuth(user, password)) {
    return res.status(HttpCode.UNAUTHORIZED)
						.json({errors: {password: LoginMessage.WRONG_PASSWORD}});
  }

  res.locals.user = user;
  return next();
};
