'use strict';

const express = require(`express`);
const api = require(`../api`).getApi();

const router = new express.Router();

router.get(`/`, async (req, res) => {

  const articles = await api.getArticles({userId: 1});

  res.render(`my`, {articles});
});

router.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles(1);
  res.render(`my/comments`, {articles});
});

router.get(`/comments/delete/:id`, async (req, res) => {
  const {id} = req.params;
  const {articleId} = req.query;

  try {
    await api.deleteComment(id, articleId);

  } catch (error) {
    console.log(error.message);
  }

  res.redirect(`/my/comments`);
});

module.exports = router;
