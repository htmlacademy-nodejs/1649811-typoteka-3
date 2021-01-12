'use strict';

const express = require(`express`);
const api = require(`../api`).getApi();

const router = new express.Router();

router.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`my`, {articles});
});
router.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`comments`, {articles: articles.slice(0, 3)});
});

module.exports = router;
