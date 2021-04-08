'use strict';

const express = require(`express`);
const {HttpCode} = require(`../const`);
const authenticateJwt = require(`../middleware/authenticate-jwt`);
const categorySchema = require(`../middleware/category-schema`);
const {asyncWrapper} = require(`../utils`);

const validator = require(`../middleware/schema-validator`)(categorySchema);


module.exports = (app, service) => {
  const router = new express.Router();

  router.get(`/`, asyncWrapper(async (req, res) => {
    const {all} = req.query;

    const categories = all
      ? await service.findAll()
      : await service.findAllOnlyHavingArticles();

    return res.status(HttpCode.OK).json(categories);
  }));

  router.get(`/:id`, asyncWrapper(async (req, res) => {
    const {id} = req.params;

    const category = await service.findOne(id);

    return res.status(HttpCode.OK).json(category);
  }));

  router.post(`/`, authenticateJwt, validator, asyncWrapper(async (req, res) => {
    const article = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  }));

  router.put(`/:id`, authenticateJwt, validator, asyncWrapper(async (req, res) => {
    const {id} = req.params;

    const updated = await service.update(id, req.body);

    if (!updated) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
    }

    return res.status(HttpCode.OK).json(updated);
  }));

  router.delete(`/:id`, authenticateJwt, asyncWrapper(async (req, res) => {
    const {id} = req.params;

    const deleted = await service.drop(id);

    if (!deleted) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(`Not found category with ${id} id`);
    }

    return res.status(HttpCode.OK).json(deleted);
  }));


  app.use(`/categories`, router);
};
