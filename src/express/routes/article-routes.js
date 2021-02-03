'use strict';

const express = require(`express`);
const {calculatePagination, getTotalPages, asyncWrapper} = require(`../../utils`);
const {
  emptyArticle,
  getRequestData,
  upload,
  movePicture,
} = require(`./article-helper`);


const api = require(`../api`).getApi();

const router = new express.Router();

router.get(`/category/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [page, limit, offset] = calculatePagination(req.query);

  const [{count, articles}, category] = await Promise.all([
    await api.getCategoryArticles(id, {limit, offset}),
    await api.getCategory(id),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`article/by-category`, {category, articles, page, totalPages});
}));


router.get(`/add`, asyncWrapper(async (req, res) => {
  const newArticle = Object.assign({}, emptyArticle);
  newArticle.createdDate = new Date();

  const categories = await api.getCategories();

  res.render(`my/post-add`, {article: newArticle, categories});
}));

router.post(`/add`, upload.single(`picture`), asyncWrapper(async (req, res) => {

  const [isPictureExist, articleData] = getRequestData(req);

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);

    if (isPictureExist) {
      await movePicture(articleData.picture);
    }

  } catch (error) {
    console.error(error.message);

    const categories = await api.getCategories();
    res.render(`my/post-add`, {article: articleData, categories});
  }
}));

router.get(`/edit/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    await api.getArticle(id),
    await api.getCategories(),
  ]);

  res.render(`my/post-edit`, {article, categories});
}));

router.post(`/edit/:id`, upload.single(`picture`), asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const [isPictureExist, articleData] = getRequestData(req);

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);

    if (isPictureExist) {
      await movePicture(articleData.picture);
    }
  } catch (error) {
    console.error(error.message);

    const categories = await api.getCategories();
    articleData.id = id;
    res.render(`my/post-edit`, {article: articleData, categories});
  }
}));

router.get(`/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);

  res.render(`article/post`, {article});
}));

router.get(`/delete/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  try {
    await api.deleteArticle(id);
  } catch (error) {
    console.log(error.message);
  }

  res.redirect(`/my`);
}));

module.exports = router;
