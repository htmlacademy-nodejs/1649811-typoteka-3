'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);

const router = new express.Router();

module.exports = (app, service) => {
  router.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK).json(categories);
  });

  app.use(`/categories`, router);
};

