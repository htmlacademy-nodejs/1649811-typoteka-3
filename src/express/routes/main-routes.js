'use strict';

const express = require(`express`);
const api = require(`../api`).getApi();

const router = new express.Router();

router.get(`/`, async (req, res) => {

  const [
    articles,
    categories,
  ] = await Promise.all([
    api.getArticles(),
    api.getCategories(true),
  ]);

  res.render(`main`, {articles, categories});
});

router.get(`/register`, (req, res) => res.render(`sign-up`));
router.get(`/login`, (req, res) => res.render(`login`));

router.get(`/search`, async (req, res) => {
  const {query} = req.query;

  if (!query) {
    res.render(`main/search`, {results: []});
    return;
  }

  try {
    const results = await api.search(query);
    res.render(`main/search`, {results});
  } catch (error) {
    console.error(error.message);
    res.render(`main/search`, {results: []});
  }

});

module.exports = router;
