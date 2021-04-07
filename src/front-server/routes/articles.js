'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const he = require(`he`);
const privateRoute = require(`../middleware/private-route`);
const {
  calculatePagination, getTotalPages, asyncWrapper, removeUploadedImage, moveUploadedImage,
} = require(`../utils`);
const {emptyArticle, getRequestData, upload} = require(`./article-helper`);
const {COOKIE_ACCESS} = require(`../const`);


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

  const categories = await api.getAllCategories();

  res.render(`my/post-add`, {article: newArticle, categories});
}));

router.post(`/add`, privateRoute, upload.single(`picture`), asyncWrapper(async (req, res) => {
  let isPictureExist;
  let articleData;

  try {
    [isPictureExist, articleData] = getRequestData(req);
    const {accessToken} = res.locals;

    console.log(articleData);

    await api.createArticle(articleData, accessToken);
    res.redirect(`/my`);

    if (isPictureExist) {
      await moveUploadedImage(articleData.picture);
    }

  } catch (error) {
    const categories = await api.getAllCategories();
    articleData.createdAt = new Date().toISOString();
    if (isPictureExist) {
      await removeUploadedImage(articleData.picture);
      articleData.picture = ``;
    }
    const {errors} = error.response.data;

    res.render(`my/post-add`, {article: articleData, categories, errors});
  }
}));

router.get(`/edit/:id`, privateRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    await api.getArticle(id),
    await api.getAllCategories(),
  ]);

  res.render(`my/post-edit`, {article, categories});
}));

router.post(`/edit/:id`, privateRoute, upload.single(`picture`), asyncWrapper(async (req, res) => {
  let id;
  let isPictureExist;
  let articleData;

  try {
    ({id} = req.params);
    [isPictureExist, articleData] = getRequestData(req);
    const {accessToken} = res.locals;

    await api.editArticle(id, articleData, accessToken);
    res.redirect(`/my`);

    if (isPictureExist) {
      await moveUploadedImage(articleData.picture);
    }
  } catch (error) {
    const categories = await api.getAllCategories();

    articleData.id = id;
    articleData.createdAt = new Date().toISOString();
    if (isPictureExist) {
      await removeUploadedImage(articleData.picture);
      articleData.picture = ``;
    }

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
  try {
    const accessToken = req.signedCookies[COOKIE_ACCESS];
    await api.deleteArticle(id, accessToken);
  } catch (error) {
    console.log(error.message);
  }

  res.redirect(`/my`);
}));

router.post(`/:id/comments`, privateRoute, bodyParser.urlencoded({extended: true}), asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  const {loggedUser} = res.locals;

  const data = {
    text: he.escape(comment),
    userId: loggedUser.id,
  };

  try {
    const accessToken = req.signedCookies[COOKIE_ACCESS];
    await api.createComment(id, data, accessToken);
    res.redirect(`/articles/${id}`);

  } catch (err) {
    const {message: errorMessage} = err.response.data;

    const article = await api.getArticle(id, true);

    res.render(`article/post`, {article, comment: data.text, errorMessage});
  }

}));

module.exports = router;
