'use strict';

const express = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const getMockData = require(`../lib/get-mock-data`);
const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService
} = require(`../data-service`);

const app = new express.Router();

(async () => {
  const articles = await getMockData();

  category(app, new CategoryService(articles));
  article(app, new ArticleService(articles), new CommentService());
  search(app, new SearchService(articles));

})();

module.exports = app;
