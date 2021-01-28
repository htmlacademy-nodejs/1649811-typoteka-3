'use strict';

const express = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../model`);

const app = new express.Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));

})();

module.exports = app;
