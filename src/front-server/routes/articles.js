'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const he = require(`he`);
const privateRoute = require(`../middleware/private-route`);
const adminRoute = require(`../middleware/admin-route`);
const {asyncWrapper, removeUploadedImage} = require(`../utils`);
const {emptyArticle, getRequestData, upload} = require(`./article-helper`);

const api = require(`../api`).getApi();
const router = new express.Router();


router.get(`/add`, adminRoute, asyncWrapper(async (req, res) => {
  const newArticle = {...emptyArticle};
  newArticle.createdDate = new Date();

  const categories = await api.getCategories({all: true});

  res.render(`admin/post-add`, {article: newArticle, categories});
}));

router.post(`/add`, adminRoute, upload.single(`picture`), asyncWrapper(async (req, res) => {
  let articleData;
  let {articlePicture} = req.session;

  try {
    articleData = getRequestData(req);
    const {accessToken} = res.locals;

    if (articlePicture && articlePicture !== articleData.picture) {
      await removeUploadedImage(articlePicture);
    }
    req.session.articlePicture = articleData.picture;

    const article = await api.createArticle(articleData, accessToken);
    delete req.session.articlePicture;

    res.redirect(`/articles/${article.id}`);

  } catch (error) {
    const categories = await api.getCategories({all: true});
    articleData.createdAt = new Date().toISOString();
    const {errors} = error.response.data;

    res.render(`admin/post-add`, {article: articleData, categories, errors});
  }
}));

router.get(`/edit/:id`, adminRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    await api.getArticle(id),
    await api.getCategories({all: true}),
  ]);

  req.session.articlePicture = article.picture;

  res.render(`admin/post-edit`, {article, categories});
}));

router.post(`/edit/:id`, adminRoute, upload.single(`picture`), asyncWrapper(async (req, res) => {
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
    res.redirect(`/articles/${id}`);

  } catch (error) {
    const {errors} = error.response.data;
    const categories = await api.getCategories({all: true});
    articleData.id = id;
    articleData.createdAt = new Date().toISOString();

    res.render(`admin/post-edit`, {article: articleData, categories, errors});
  }
}));

router.get(`/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const [
    article,
    categories,
  ] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories({articleId: id}),
  ]);

  res.render(`article/post`, {article, categories, comment: null});
}));

router.get(`/delete/:id`, adminRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  const {accessToken} = res.locals;
  await api.deleteArticle(id, accessToken);
  if (article.picture) {
    await removeUploadedImage(article.picture);
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
    const errorMessages = Object.values(errors).join(` `);

    res.render(`article/post`, {article, comment: data.text, errorMessages});
  }
}));

module.exports = router;
