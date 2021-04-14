'use strict';

const {Router} = require(`express`);
const newUserSchema = require(`../middleware/new-user-schema`);
const userSchema = require(`../middleware/user-schema`);
const validator = require(`../middleware/schema-validator`);
const alreadyExist = require(`../middleware/already-register`);
const authenticate = require(`../middleware/authenticate`);
const makeTokens = require(`../lib/jwt-helper`);
const jwt = require(`jsonwebtoken`);
const {asyncWrapper} = require(`../utils`);
const {HttpCode} = require(`../const`);
const {JWT_REFRESH_SECRET} = process.env;


module.exports = (app, userService, tokenService) => {
  const route = new Router();

  route.post(`/user`, [validator(newUserSchema), alreadyExist(userService)], asyncWrapper(async (req, res) => {
    const isCreated = await userService.create(req.body);
    return isCreated ? res.status(HttpCode.CREATED).json() : res.status(HttpCode.BAD_REQUEST).json();
  }));

  route.post(`/login`, [validator(userSchema), authenticate(userService)], asyncWrapper(async (req, res) => {
    const {user} = res.locals;

    delete user.password;
    delete user.createdAt;

    const {accessToken, refreshToken} = makeTokens(user);
    const token = await tokenService.create(refreshToken);
    if (!token) {
      return res.sendStatus(HttpCode.UNAUTHORIZED);
    }

    return res.status(HttpCode.OK).json({accessToken, refreshToken});
  }));

  route.post(`/refresh`, asyncWrapper(async (req, res) => {
    const {token} = req.body;

    if (!token) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
    }

    const existToken = await tokenService.find(token);

    if (!existToken) {
      return res.sendStatus(HttpCode.NOT_FOUND);
    }

    jwt.verify(token, JWT_REFRESH_SECRET, async (err, userData) => {
      if (err) {
        return res.sendStatus(HttpCode.FORBIDDEN);
      }
      const {id, firstname, lastname, email, avatar, role} = userData;

      const {accessToken, refreshToken} = makeTokens(
        {id, firstname, lastname, email, avatar, role},
      );

      await existToken.destroy();

      const isCreated = await tokenService.create(refreshToken);
      if (isCreated) {
        return res.status(HttpCode.OK).json({accessToken, refreshToken});
      }

      return res.sendStatus(HttpCode.FORBIDDEN);
    });

    return null;
  }));

  route.delete(`/logout`, asyncWrapper(async (req, res) => {
    const {token} = req.body;
    await tokenService.drop(token);
    res.sendStatus(HttpCode.OK);
  }));
  app.use(`/`, route);
};
