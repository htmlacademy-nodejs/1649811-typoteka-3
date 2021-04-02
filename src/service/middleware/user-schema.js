'use strict';

const Joi = require(`joi`);
const {RegisterMessage} = require(`../../const-messages`);

module.exports = Joi.object({

  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.base': RegisterMessage.WRONG_EMAIL,
      'string.email': RegisterMessage.WRONG_EMAIL,
      'string.empty': `email ${RegisterMessage.EMPTY_VALUE}`,
      'any.required': `email ${RegisterMessage.REQUIRED_FIELD}`,
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.base': `Пароль ${RegisterMessage.REQUIRED_FIELD}`,
      'any.required': `Пароль ${RegisterMessage.REQUIRED_FIELD}`,
    }),

});
