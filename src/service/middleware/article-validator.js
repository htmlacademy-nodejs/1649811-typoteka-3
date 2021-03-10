'use strict';

const baseValidator = require(`src/service/middleware/schema-validator`);

const articleKeys = [`title`, `categories`, `announce`, `userId`];

module.exports = baseValidator(articleKeys);
