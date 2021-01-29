'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);

const api = require(`../api`).getApi();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const router = new express.Router();

router.get(`/`, async (req, res) => {
  const categories = await api.getCategories(true);

  res.render(`my/categories`, {categories});
});

router.post(`/add`, urlencodedParser, async (req, res) => {
  const {body: {category}} = req;

  try {
    const newCategory = await api.createCategory({title: category});

    res.redirect(`/articles/category/${newCategory.id}`);

  } catch (err) {
    console.log(err.message);

    res.redirect(`/categories`);
  }
});

router.post(`/edit/:id`, urlencodedParser, async (req, res) => {
  const {id} = req.params;
  const {body: {category}} = req;

  try {
    await api.updateCategory(id, {title: category});
  } catch (err) {
    console.log(err.message);
  }

  res.redirect(`/categories`);

});

router.get(`/delete/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteCategory(id);
  } catch (err) {
    console.log(err.message);
  }

  res.redirect(`/categories`);
});

module.exports = router;

