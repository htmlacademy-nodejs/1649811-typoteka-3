'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const he = require(`he`);
const privateRoute = require(`../middleware/private-route`);
const {
  calculatePagination, getTotalPages, asyncWrapper, removeUploadedImage
} = require(`../utils`);
const {emptyArticle, getRequestData, upload} = require(`./article-helper`);


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

router.get(`/add`, privateRoute, asyncWrapper(async (req, res) => {
  const newArticle = Object.assign({}, emptyArticle);
  newArticle.createdDate = new Date();

  const categories = await api.getCategories(true);

  res.render(`my/post-add`, {article: newArticle, categories});
}));

router.post(`/add`, privateRoute, upload.single(`picture`), asyncWrapper(async (req, res) => {
  let articleData;
  let {articlePicture} = req.session;

  try {
    articleData = getRequestData(req);
    const {accessToken} = res.locals;

    if (articlePicture && articlePicture !== articleData.picture) {
      await removeUploadedImage(articlePicture);
    }
    req.session.articlePicture = articleData.picture;

    await api.createArticle(articleData, accessToken);

    delete req.session.articlePicture;
    res.redirect(`/my`);

  } catch (error) {
    const categories = await api.getCategories(true);
    articleData.createdAt = new Date().toISOString();
    const {errors} = error.response.data;

    res.render(`my/post-add`, {article: articleData, categories, errors});
  }
}));

router.get(`/edit/:id`, privateRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    await api.getArticle(id),
    await api.getCategories(true),
  ]);

  req.session.articlePicture = article.picture;

  res.render(`my/post-edit`, {article, categories});
}));

router.post(`/edit/:id`, privateRoute, upload.single(`picture`), asyncWrapper(async (req, res) => {
  let id;
  let articleData;
  let {articlePicture} = req.session;

  try {
    ({id} = req.params);
    articleData = getRequestData(req);
    const {accessToken} = res.locals;

    if (articlePicture && articlePicture !== articleData.picture) {
      await removeUploadedImage(articlePicture);
    }

    req.session.articlePicture = articleData.picture;
    await api.editArticle(id, articleData, accessToken);

    delete req.session.articlePicture;
    res.redirect(`/my`);

  } catch (error) {
    console.log(error.message);
    const categories = await api.getCategories(true);

    articleData.id = id;
    articleData.createdAt = new Date().toISOString();

    const {errors} = error.response.data;

    res.render(`my/post-edit`, {article: articleData, categories, errors});
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

router.get(`/delete/:id`, privateRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  try {
    const {accessToken} = res.locals;
    await api.deleteArticle(id, accessToken);
    if (article.picture) {
      await removeUploadedImage(article.picture);
    }
  } catch (error) {
    console.log(error.message);
  }

  res.redirect(`/my`);
}));

router.post(`/:id/comments`, privateRoute, bodyParser.urlencoded({extended: true}), asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  const data = {text: he.escape(comment)};

  try {
    const {accessToken} = res.locals;
    await api.createComment(id, data, accessToken);
    res.redirect(`/articles/${id}`);

  } catch (err) {
    const {errors} = err.response.data;

    const article = await api.getArticle(id, true);

    res.render(`article/post`, {article, comment: data.text, errorMessages: errors});
  }

}));

module.exports = router;
