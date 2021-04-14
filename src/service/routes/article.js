'use strict';

const express = require(`express`);

const articleExists = require(`../middleware/article-exists`);
const articleSchema = require(`../middleware/article-schema`);
const commentSchema = require(`../middleware/comment-schema`);
const validator = require(`../middleware/schema-validator`);
const authenticateJwt = require(`../middleware/authenticate-jwt`);
const adminRoute = require(`../middleware/admin-route`);
const {asyncWrapper} = require(`../utils`);
const {HttpCode} = require(`../const`);


module.exports = (app, articleService, commentService) => {
  const router = new express.Router();

  router.get(`/`, asyncWrapper(async (req, res) => {
    const {limit, offset, categoryId} = req.query;
    const result = (limit || offset)
      ? await articleService.findPage({limit, offset, categoryId})
      : await articleService.findAll();

    return res.status(HttpCode.OK).json(result);
  }));

  router.get(`/comments`, authenticateJwt, adminRoute, asyncWrapper(async (req, res) => {
    const result = await commentService.getAll();
    return res.status(HttpCode.OK).json(result);
  }));

  router.get(`/most-popular`, asyncWrapper(async (req, res) => {
    const [mostPopular, lastComments] = await Promise.all([
      articleService.findMostPopular(),
      commentService.findLastComments(),
    ]);
    return res.status(HttpCode.OK).json({mostPopular, lastComments});
  }));

  router.get(`/:articleId`, articleExists(articleService), asyncWrapper(async (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  }));

  router.post(`/`, authenticateJwt, adminRoute, validator(articleSchema), asyncWrapper(async (req, res) => {
    let article;
    const {user} = res.locals;
    const data = req.body;
    article = await articleService.create(data, user.id);

    return res.status(HttpCode.CREATED).json(article);
  }));

  router.put(
      `/:articleId`,
      authenticateJwt, articleExists(articleService), adminRoute, validator(articleSchema),
      asyncWrapper(async (req, res) => {
        const {articleId} = req.params;
        const updated = await articleService.update(articleId, req.body);

        return res.status(HttpCode.OK).json(updated);
      }));

  router.delete(
      `/:articleId`,
      authenticateJwt, adminRoute, articleExists(articleService),
      asyncWrapper(async (req, res) => {
        const {articleId} = req.params;
        const isDeleted = await articleService.drop(articleId);

        return res.status(HttpCode.OK).json(isDeleted);
      }));

  router.get(
      `/:articleId/comments`,
      articleExists(articleService),
      asyncWrapper(async (req, res) => {
        const {article} = res.locals;
        const comments = await commentService.findAll(article.id);

        return res.status(HttpCode.OK).json(comments);
      }));

  router.post(`/:articleId/comments`,
      authenticateJwt, articleExists(articleService), validator(commentSchema),
      asyncWrapper(async (req, res) => {
        const {article} = res.locals;
        const {user} = res.locals;
        const comment = await commentService.create(article.id, user.id, req.body);

        return res.status(HttpCode.CREATED).json(comment);
      }));

  router.delete(
      `/comments/:commentId`,
      authenticateJwt, adminRoute,
      asyncWrapper(async (req, res) => {
        const {commentId} = req.params;
        const isDeleted = await commentService.drop(commentId);

        if (!isDeleted) {
          return res.sendStatus(HttpCode.NOT_FOUND);
        }

        return res.sendStatus(HttpCode.OK);
      }));

  app.use(`/articles`, router);
};
