'use strict';

const Joi = require(`joi-plus`);
const {ArticleMessage} = require(`../const-messages`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .escape()
    .messages({
      'string.min': ArticleMessage.MIN_TITLE_LENGTH,
      'string.max': ArticleMessage.MAX_TITLE_LENGTH,
      'any.required': ArticleMessage.REQUIRED_FIELD,
    }),

  createdAt: Joi.date()
    .required().messages({
      'any.required': ArticleMessage.REQUIRED_FIELD,
      'date.base': ArticleMessage.WRONG_DATE_FORMAT,
    }),

  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .escape()
    .messages({
      'string.min': ArticleMessage.MIN_ANNOUNCE_LENGTH,
      'string.max': ArticleMessage.MAX_ANNOUNCE_LENGTH,
      'any.required': ArticleMessage.REQUIRED_FIELD,
    }),

  fullText: Joi.string()
    .allow(``, null)
    .max(1000)
    .escape()
    .messages({
      'string.max': ArticleMessage.MAX_TEXT_LENGTH,
    }),

  categories: Joi.array()
    .items(Joi.number().min(1).required())
    .required()
    .messages({
      'array.includesRequiredUnknowns': ArticleMessage.EMPTY_CATEGORY,
      'any.required': ArticleMessage.REQUIRED_FIELD,
    }),

  picture: Joi.string()
    .allow(``, null)
    .regex(/\.(jpe?g|png)$/i)
    .max(255)
    .messages({
      'string.pattern.base': ArticleMessage.IMAGE_FORMAT,
      'string.max': ArticleMessage.MAX_IMAGE_LENGTH,
    }),

});

