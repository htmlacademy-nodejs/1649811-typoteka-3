'use strict';

const express = require(`express`);

const articleExists = require(`../middleware/article-exists`);
const articleSchema = require(`../middleware/article-schema`);
const commentSchema = require(`../middleware/comment-schema`);
const validator = require(`../middleware/schema-validator`);
const authenticateJwt = require(`../middleware/authenticate-jwt`);
const {asyncWrapper} = require(`../utils`);
const {HttpCode} = require(`../const`);


module.exports = (app, articleService, commentService) => {
  const router = new express.Router();

  router.get(`/`, asyncWrapper(async (req, res) => {
    const {comments, userId, limit, offset} = req.query;

    const articles = (limit || offset)
      ? await articleService.findPage({limit, offset, userId, comments})
      : await articleService.findAll({userId, comments});


    if (!articles) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found articles`);
    }

    return res.status(HttpCode.OK).json(articles);
  }));

  router.get(`/:articleId`, articleExists(articleService), asyncWrapper(async (req, res) => {
    const {article} = res.locals;
    return res.status(HttpCode.OK).json(article);
  }));

  router.post(`/`, authenticateJwt, validator(articleSchema), asyncWrapper(async (req, res) => {
    let article;

    try {
      const {user} = res.locals;
      const data = req.body;
      data.userId = user.id;
      article = await articleService.create(data);
    } catch (err) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
    }

    return res.status(HttpCode.CREATED).json(article);
  }));

  router.put(`/:articleId`, authenticateJwt, validator(articleSchema), asyncWrapper(async (req, res) => {
    const {articleId} = req.params;

    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(updated);
  }));

  router.delete(`/:articleId`, authenticateJwt, asyncWrapper(async (req, res) => {
    const {articleId} = req.params;
    const isDeleted = await articleService.drop(articleId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(isDeleted);
  }));

  router.get(`/:articleId/comments`, articleExists(articleService), asyncWrapper(async (req, res) => {
    const {article} = res.locals;

    const comments = await commentService.findAll(article.id);

    return res.status(HttpCode.OK).json(comments);
  }));

  router.post(`/:articleId/comments`, authenticateJwt, articleExists(articleService), validator(commentSchema), asyncWrapper(async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  }));

  router.delete(`/:articleId/comments/:commentId`, authenticateJwt, articleExists(articleService), asyncWrapper(async (req, res) => {
    const {commentId} = req.params;
    const isDeleted = await commentService.drop(commentId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found comment with ${commentId} id`);
    }

    return res.status(HttpCode.OK).json(isDeleted);
  }));

  router.get(`/category/:id`, asyncWrapper(async (req, res) => {
    const {id} = req.params;
    const {limit, offset} = req.query;

    const articles = await articleService.findAllByCategory(id, {limit, offset});

    if (!articles) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found articles`);
    }

    return res.status(HttpCode.OK).json(articles);
  }));

  app.use(`/articles`, router);
};
