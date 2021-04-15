'use strict';

const express = require(`express`);
const {HttpCode} = require(`../const`);
const authenticateJwt = require(`../middleware/authenticate-jwt`);
const categorySchema = require(`../middleware/schema/category-schema`);
const adminRoute = require(`../middleware/admin-route`);
const {asyncWrapper} = require(`../utils`);

const validator = require(`../middleware/schema-validator`)(categorySchema);


module.exports = (app, service) => {
  const router = new express.Router();

  router.get(`/`, asyncWrapper(async (req, res) => {
    const {all, articleId} = req.query;

    let categories;
    if (articleId) {
      categories = await service.findByArticle(articleId);
    } else if (all) {
      categories = await service.findAll();
    } else {
      categories = await service.findOnlyHavingArticles();
    }

    return res.status(HttpCode.OK).json(categories);
  }));

  router.get(`/:id`, asyncWrapper(async (req, res) => {
    const {id} = req.params;
    const category = await service.findOne(id);

    return res.status(HttpCode.OK).json(category);
  }));

  router.post(`/`, authenticateJwt, adminRoute, validator, asyncWrapper(async (req, res) => {
    const category = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(category);
  }));

  router.put(`/:id`, authenticateJwt, adminRoute, validator, asyncWrapper(async (req, res) => {
    const {id} = req.params;
    const updated = await service.update(id, req.body);

    return res.status(HttpCode.OK).json(updated);
  }));

  router.delete(`/:id`, authenticateJwt, adminRoute, asyncWrapper(async (req, res) => {
    const {id} = req.params;
    const deleted = await service.drop(id);
    if (!deleted) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
    }

    return res.sendStatus(HttpCode.OK);
  }));


  app.use(`/categories`, router);
};
