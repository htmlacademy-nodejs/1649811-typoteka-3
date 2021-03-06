'use strict';

const express = require(`express`);

const api = require(`../api`).getApi();
const {calculatePagination, getTotalPages, asyncWrapper} = require(`../utils`);
const router = new express.Router();


router.get(`/`, asyncWrapper(async (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);
  const [
    {count, articles},
    categories,
    {lastComments, mostPopular}
  ] = await Promise.all([
    api.getArticles(limit, offset),
    api.getCategories(),
    api.getMostPopular(),
  ]);

  const totalPages = getTotalPages(count);
  res.render(`main`, {articles, categories, lastComments, mostPopular, page, totalPages});
}));

router.get(`/search`, asyncWrapper(async (req, res) => {
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

}));

module.exports = router;
