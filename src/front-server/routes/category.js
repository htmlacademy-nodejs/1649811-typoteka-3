'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const privateRoute = require(`../middleware/private-route`);
const {asyncWrapper} = require(`../utils`);

const api = require(`../api`).getApi();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const router = new express.Router();

router.get(`/`, asyncWrapper(async (req, res) => {
  const categories = await api.getAllCategories();

  res.render(`my/categories`, {categories});
}));

router.post(`/add`, privateRoute, urlencodedParser, asyncWrapper(async (req, res) => {
  const {body: {category}} = req;

  try {
    const {accessToken} = res.locals;
    const newCategory = await api.createCategory({title: category}, accessToken);

    res.redirect(`/articles/category/${newCategory.id}`);

  } catch (err) {
    console.log(err.message);

    res.redirect(`/categories`);
  }
}));

router.post(`/edit/:id`, privateRoute, urlencodedParser, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {body: {category}} = req;

  try {
    const {accessToken} = res.locals;
    await api.updateCategory(id, {title: category}, accessToken);
  } catch (err) {
    console.log(err.message);
  }

  res.redirect(`/categories`);

}));

router.get(`/delete/:id`, privateRoute, asyncWrapper(async (req, res) => {
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

