'use strict';

const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const ArticleService = require(`./article`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);
const TokenService = require(`./refresh-token`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  ArticleService,
  UserService,
  TokenService,
};
