'use strict';

const baseValidator = require(`./base-validator`);

const articleKeys = [`title`, `categories`, `announce`, `userId`];

module.exports = baseValidator(articleKeys);
