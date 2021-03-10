'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const {
  calculatePagination, getTotalPages, asyncWrapper, escapeHtml
} = require(`../../utils`);
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
    await api.getArticlesByCategory(id, {limit, offset}),
    await api.getCategory(id),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`article/by-category`, {category, articles, page, totalPages});
}));


router.get(`/add`, asyncWrapper(async (req, res) => {
  const newArticle = Object.assign({}, emptyArticle);
  newArticle.createdDate = new Date();

  const categories = await api.getAllCategories();

  res.render(`my/post-add`, {article: newArticle, categories, errorMessages: []});
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
    const {message: errorMessages} = error.response.data;

    const categories = await api.getAllCategories();
    res.render(`my/post-add`, {article: articleData, categories, errorMessages});
  }
}));

router.get(`/edit/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    await api.getArticle(id),
    await api.getAllCategories(),
  ]);

  res.render(`my/post-edit`, {article, categories, errorMessages: []});
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

    const {message: errorMessages} = error.response.data;

    const categories = await api.getAllCategories();
    articleData.id = id;
    res.render(`my/post-edit`, {article: articleData, categories, errorMessages});
  }
}));

router.get(`/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);

  if (article.comments) {
    article.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.render(`article/post`, {article, comment: null});
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

router.post(`/:id/comments`, bodyParser.urlencoded({extended: true}), asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  const data = {
    text: escapeHtml(comment),
    userId: 1,
  };

  try {
    await api.createComment(id, data);
    res.redirect(`/articles/${id}`);

  } catch (err) {
    const {message: errorMessage} = err.response.data;

    const article = await api.getArticle(id, true);

    res.render(`article/post`, {article, comment: data.text, errorMessage});
  }

}));

module.exports = router;
