'use strict';

const baseValidator = require(`src/service/middleware/schema-validator`);

const commentKeys = [`text`];

module.exports = baseValidator(commentKeys);
