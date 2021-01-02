'use strict';

const baseValidator = require(`./base-validator`);

const articleKeys = [`title`, `createdDate`, `category`, `announce`];

module.exports = baseValidator(articleKeys);
