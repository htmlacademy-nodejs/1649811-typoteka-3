'use strict';

const Joi = require(`joi-plus`);
const {CategoryMessage} = require(`../../const-messages`);

module.exports = Joi.object({
  title: Joi.string()
    .min(5)
    .max(30)
    .required()
    .escape()
    .messages({
      'string.min': CategoryMessage.MIX_TEXT_TITLE,
      'string.max': CategoryMessage.MAX_TEXT_TITLE,
      'any.required': CategoryMessage.REQUIRED_FIELD,
    }),
});

