'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middleware/article-validator`);
const articleExists = require(`../middleware/article-exists`);
const commentValidator = require(`../middleware/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const router = new express.Router();

  router.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    if (!articles) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found articles`);
    }

    return res.status(HttpCode.OK).json(articles);
  });

  router.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  router.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  router.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    const updatedArticle = articleService.update(articleId, req.body);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  router.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.drop(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  router.get(`/:articleId/comments`, articleExists(articleService),
      (req, res) => {
        const {article} = res.locals;

        const comments = commentService.findAll(article);

        return res.status(HttpCode.OK).json(comments);
      });

  router.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  router.delete(`/:articleId/comments/:commentId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment with ${commentId} id`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });


  app.use(`/articles`, router);
};
