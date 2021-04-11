'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const adminRoute = require(`../middleware/admin-route`);
const {asyncWrapper, calculatePagination, getTotalPages} = require(`../utils`);

const api = require(`../api`).getApi();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const router = new express.Router();

router.get(`/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  try {
    const [page, limit, offset] = calculatePagination(req.query);

    const [{count, articles}, categories] = await Promise.all([
      await api.getArticles(limit, offset, id),
      await api.getCategories({all: true}),
    ]);

    const totalPages = getTotalPages(count);
    const currentCategory = categories.find((item) => +item.id === +id);

    res.render(`article/by-category`, {categories, currentCategory, articles, page, totalPages});
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
}));

router.get(`/`, adminRoute, asyncWrapper(async (req, res) => {
  const categories = await api.getCategories({all: true});

  res.render(`admin/categories`, {categories, newCategory: {title: ``}});
}));

router.post(`/add`, adminRoute, urlencodedParser, asyncWrapper(async (req, res) => {
  const {body: {category}} = req;
  let newCategory;

  try {
    const {accessToken} = res.locals;
    newCategory = await api.createCategory({title: category}, accessToken);

    res.redirect(`/categories/${newCategory.id}`);

  } catch (err) {
    console.log(err.message);

    const {errors} = err.response.data;
    const categories = await api.getCategories({all: true});

    res.render(`admin/categories`, {categories, newCategoryErrors: errors, newCategory: {title: category}});
  }
}));

router.post(`/edit/:id`, adminRoute, urlencodedParser, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {body: {category}} = req;

  try {
    const {accessToken} = res.locals;
    await api.updateCategory(id, {title: category}, accessToken);
    res.redirect(`/categories`);
  } catch (err) {
    const {errors} = err.response.data;
    const categories = await api.getCategories({all: true});
    const edit = categories.find((item) => +item.id === +id);
    edit.title = category;
    edit.errors = Object.values(errors).join(` `);

    res.render(`admin/categories`, {categories, newCategory: {title: ``}});
  }
}));

router.get(`/delete/:id`, adminRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  try {
    const {accessToken} = res.locals;
    await api.deleteCategory(id, accessToken);
  } catch (err) {
    console.log(err.message);
  }

  res.redirect(`/categories`);
}));

module.exports = router;

