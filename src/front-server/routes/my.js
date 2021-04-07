'use strict';

const express = require(`express`);
const {asyncWrapper} = require(`../utils`);
const api = require(`../api`).getApi();
const privateRoute = require(`../middleware/private-route`);


const router = new express.Router();

router.get(`/`, privateRoute, asyncWrapper(async (req, res) => {
  const {loggedUser} = res.locals;

  const articles = await api.getArticles({userId: loggedUser.id});

  res.render(`my`, {articles});
}));

router.get(`/comments`, privateRoute, asyncWrapper(async (req, res) => {
  const {loggedUser} = res.locals;
  const articles = await api.getArticles({userId: loggedUser.id, comments: true});
  res.render(`my/comments`, {articles});
}));

router.get(`/comments/delete/:id`, privateRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {articleId} = req.query;

  try {
    const {accessToken} = res.locals;
    await api.deleteComment(id, articleId, accessToken);

  } catch (error) {
    res.redirect(`/my/comments`);
  }

  res.redirect(`/my/comments`);
}));

module.exports = router;
