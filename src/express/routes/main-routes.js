'use strict';

const express = require(`express`);
const api = require(`../api`).getApi();

const router = new express.Router();

router.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

router.get(`/register`, (req, res) => res.render(`sign-up`));
router.get(`/login`, (req, res) => res.render(`login`));

router.get(`/search`, async (req, res) => {
  const {q} = req.query;

  if (!q) {
    res.render(`main/search`, {results: []});
    return;
  }

  try {
    const results = await api.search(q);
    res.render(`main/search`, {results});
  } catch (error) {
    console.error(error.message);
    res.render(`main/search`, {results: []});
  }

});

module.exports = router;
