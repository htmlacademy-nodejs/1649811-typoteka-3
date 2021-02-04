'use strict';

const express = require(`express`);
const {asyncWrapper} = require(`../../utils`);
const api = require(`../api`).getApi();

const router = new express.Router();

router.get(`/`, asyncWrapper(async (req, res) => {

  const articles = await api.getArticles({userId: 1});

  res.render(`my`, {articles});
}));

router.get(`/comments`, asyncWrapper(async (req, res) => {
  const articles = await api.getArticles({userId: 1, comments: true});
  res.render(`my/comments`, {articles});
}));

router.get(`/comments/delete/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {articleId} = req.query;

  try {
    await api.deleteComment(id, articleId);

  } catch (error) {
    console.log(error.message);
  }

  res.redirect(`/my/comments`);
}));

module.exports = router;
