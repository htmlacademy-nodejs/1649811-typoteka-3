'use strict';

const express = require(`express`);
const api = require(`../api`).getApi();
const {calculatePagination, getTotalPages, asyncWrapper} = require(`../../utils`);
const {emptyUser, getRequestData, absoluteUploadDir, upload} = require(`./user-helper`);
const router = new express.Router();

const PUBLIC_IMG_DIR = `../public/img`;

router.get(`/`, asyncWrapper(async (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);

  const [
    {count, articles},
    categories,
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`main`, {articles, categories, page, totalPages});
}));

router.get(`/register`, (req, res) => {
  const user = {...emptyUser};
  res.render(`main/sign-up`, {user, errorMessages: []});
});

router.post(`/register`, asyncWrapper(async (req, res) => {
  res.render(`main/sign-up`);
}));

router.get(`/login`, (req, res) => {
  res.render(`main/login`);
});

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
