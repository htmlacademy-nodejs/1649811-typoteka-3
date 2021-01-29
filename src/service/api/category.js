'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const router = new express.Router();

  router.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);

    return res.status(HttpCode.OK).json(categories);
  });

  router.post(`/`, async (req, res) => {
    const article = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  router.put(`/:id`, async (req, res) => {
    const {id} = req.params;

    const updated = await service.update(id, req.body);

    if (!updated) {
      return res.status(HttpCode.BAD_REQUEST).send(`Wrong data`);
    }

    return res.status(HttpCode.OK).json(updated);
  });

  router.delete(`/:id`, async (req, res) => {
    const {id} = req.params;

    const deleted = await service.drop(id);

    if (!deleted) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(`Not found category with ${id} id`);
    }

    return res.status(HttpCode.OK).json(deleted);
  });


  app.use(`/categories`, router);
};
