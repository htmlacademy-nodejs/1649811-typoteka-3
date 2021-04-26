'use strict';

const express = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService,
  RefreshTokenService,
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../model`);

const app = new express.Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize), new RefreshTokenService(sequelize));
})();

module.exports = app;
