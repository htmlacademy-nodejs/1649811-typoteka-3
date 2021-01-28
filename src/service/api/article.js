'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middleware/article-validator`);
const articleExists = require(`../middleware/article-exists`);
const commentValidator = require(`../middleware/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const router = new express.Router();

  router.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await articleService.findAll(comments);

    if (!articles) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found articles`);
    }

    return res.status(HttpCode.OK).json(articles);
  });

  router.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  router.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  router.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;

    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(updated);
  });

  router.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const isDeleted = await articleService.drop(articleId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(isDeleted);
  });

  router.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;

    const comments = await commentService.findAll(article.id);

    return res.status(HttpCode.OK).json(comments);
  });

  router.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  router.delete(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {commentId} = req.params;
    const isDeleted = await commentService.drop(commentId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment with ${commentId} id`);
    }

    return res.status(HttpCode.OK).json(isDeleted);
  });


  app.use(`/articles`, router);
};
