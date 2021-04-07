'use strict';

const express = require(`express`);
const csrf = require(`csurf`);
const bodyParser = require(`body-parser`);
const {asyncWrapper, moveUploadedImage, removeUploadedImage} = require(`../utils`);
const {emptyUser, getRequestData, getRequestLoginData, upload} = require(`./user-helper`);
const {COOKIE_ACCESS, COOKIE_REFRESH, userCookieOption} = require(`../const`);

const csrfProtection = csrf({cookie: {sameSite: `strict`}});
const api = require(`../api`).getApi();
const router = new express.Router();


router.get(`/register`, csrfProtection, asyncWrapper(async (req, res) => {
  res.render(`main/sign-up`, {user: {...emptyUser}, csrf: req.csrfToken()});
}));

router.post(`/register`, upload.single(`avatar`), csrfProtection, asyncWrapper(async (req, res) => {
  const {file} = req;
  const [isPictureExist, user] = getRequestData(req);

  if (isPictureExist) {
    user.avatar = file.filename;
  }

  try {
    await api.createUser(user);

    if (isPictureExist) {
      await moveUploadedImage(user.avatar);
    }

    res.redirect(`/login`);
  } catch (error) {
    if (isPictureExist) {
      await removeUploadedImage(user.avatar);
      delete user.avatar;
    }
    const {errors} = error.response.data;
    res.render(`main/sign-up`, {user, csrf: req.csrfToken(), errorMessages: Object.values(errors)});
  }
}));

router.get(`/login`, csrfProtection, asyncWrapper(async (req, res) => {
  res.render(`main/login`, {user: emptyUser, csrf: req.csrfToken()});
}));

router.post(`/login`, bodyParser.urlencoded({extended: false}), csrfProtection, asyncWrapper(async (req, res) => {
  let data;
  try {
    data = getRequestLoginData(req);

    const {accessToken, refreshToken} = await api.login(data);

    res
      .cookie(COOKIE_ACCESS, accessToken, userCookieOption)
      .cookie(COOKIE_REFRESH, refreshToken, userCookieOption)
      .redirect(`/`);

  } catch (error) {
    const {errors} = error.response.data;
    data.password = ``;
    res.render(`main/login`, {user: data, csrf: req.csrfToken(), errorMessages: Object.values(errors)});
  }
}));

router.get(`/logout`, asyncWrapper(async (req, res) => {
  const accessToken = req.signedCookies[COOKIE_ACCESS];
  const refreshToken = req.signedCookies[COOKIE_REFRESH];

  await api.logout(accessToken, refreshToken);
  res
    .clearCookie(COOKIE_ACCESS)
    .clearCookie(COOKIE_REFRESH)
    .redirect(`/`);
}));

module.exports = router;
