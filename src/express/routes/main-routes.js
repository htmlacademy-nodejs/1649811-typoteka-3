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
  try {
    const {q} = req.query;
    const results = await api.search(q);
    res.render(`search`, {results});
  } catch (error) {
    console.error(error.message);
    res.render(`search`, {results: []});
  }

});

module.exports = router;
