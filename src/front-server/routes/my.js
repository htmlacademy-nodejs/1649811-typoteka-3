'use strict';

const express = require(`express`);
const {asyncWrapper} = require(`../utils`);
const adminRoute = require(`../middleware/admin-route`);

const api = require(`../api`).getApi();
const router = new express.Router();


router.get(`/`, adminRoute, asyncWrapper(async (req, res) => {
  const {articles} = await api.getArticles();

  res.render(`admin/main`, {articles});
}));

router.get(`/comments`, adminRoute, asyncWrapper(async (req, res) => {
  const {accessToken} = res.locals;
  const comments = await api.getComments(accessToken);
  res.render(`admin/comments`, {comments});
}));

router.get(`/comments/delete/:id`, adminRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {accessToken} = res.locals;
  await api.deleteComment(id, accessToken);

  res.redirect(`/my/comments`);
}));

module.exports = router;
