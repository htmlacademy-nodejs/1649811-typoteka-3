'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_EXPIRES} = require(`../const`);
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = process.env;

const makeTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {expiresIn: JWT_EXPIRES});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);

  return {accessToken, refreshToken};
};

module.exports = makeTokens;
