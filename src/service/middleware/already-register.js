'use strict';

const {HttpCode} = require(`../const`);
const {RegisterMessage} = require(`../const-messages`);

module.exports = (service) => async (req, res, next) => {
  const {email} = req.body;

  const user = await service.findByEmail(email);

  if (user) {
    return res.status(HttpCode.BAD_REQUEST)
      .json({message: [RegisterMessage.USER_ALREADY_REGISTER]});
  }

  return next();
};
