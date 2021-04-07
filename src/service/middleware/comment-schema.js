'use strict';

const Joi = require(`joi`);
const {CommentMessage} = require(`../const-messages`);

module.exports = Joi.object({
  text: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.min': CommentMessage.MIX_TEXT_LENGTH,
      'any.required': CommentMessage.REQUIRED_FIELD,
    })
});

