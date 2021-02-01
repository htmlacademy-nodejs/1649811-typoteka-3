'use strict';

const express = require(`express`);
const api = require(`../api`).getApi();
const {calculatePagination, getTotalPages} = require(`../../utils`);

const router = new express.Router();

router.get(`/`, (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);

  // const {count, articles} = api.getArticles({limit, offset, comments: true});
  // const categories = api.getCategories(true);

  // const [
  //   {count, articles},
  //   categories,
  // ] = await Promise.all([
  //   api.getArticles({limit, offset, comments: true}),
  //   api.getCategories(true),
  // ]);

  // const totalPages = getTotalPages(count);
  //
  // res.render(`main`, {articles, categories, page, totalPages});

  Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true),
  ])
    .then((result) => {

      const {count, articles} = result[0];
      const categories = result[1];

      const totalPages = getTotalPages(count);
      res.render(`main`, {articles, categories, page, totalPages});
    })
    .catch((err) => console.log(err));
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
