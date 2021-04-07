'use strict';

const Joi = require(`joi`);
const {MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH} = require(`../const`);
const {RegisterMessage} = require(`../const-messages`);


module.exports = Joi.object({

  firstname: Joi.string()
    .regex(/^[a-zA-Zа-яА-Я]+$/i)
    .required()
    .messages({
      'string.pattern.base': `Имя ${RegisterMessage.ALPHA_VALUE}`,
      'string.base': `Имя ${RegisterMessage.ALPHA_VALUE}`,
      'string.empty': `Имя ${RegisterMessage.EMPTY_VALUE}`,
      'any.required': `Имя ${RegisterMessage.REQUIRED_FIELD}`,
    }),

  lastname: Joi.string()
    .regex(/^[a-zA-Zа-яА-Я]+$/i)
    .required()
    .messages({
      'string.pattern.base': `Фамилия ${RegisterMessage.ALPHA_VALUE}`,
      'string.base': `Фамилия ${RegisterMessage.ALPHA_VALUE}`,
      'string.empty': `Фамилия ${RegisterMessage.EMPTY_VALUE}`,
      'any.required': `Фамилия ${RegisterMessage.REQUIRED_FIELD}`,
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': RegisterMessage.WRONG_EMAIL,
      'string.email': RegisterMessage.WRONG_EMAIL,
      'string.empty': `email ${RegisterMessage.EMPTY_VALUE}`,
      'any.required': `email ${RegisterMessage.REQUIRED_FIELD}`,
    }),

  password: Joi.string()
    .required()
    .min(MIN_PASSWORD_LENGTH)
    .max(MAX_PASSWORD_LENGTH)
    .messages({
      'string.min': RegisterMessage.MIN_PASSWORD_LENGTH,
      'string.max': RegisterMessage.MAX_PASSWORD_LENGTH,
      'string.empty': `Пароль ${RegisterMessage.EMPTY_VALUE}`,
      'any.required': `Пароль ${RegisterMessage.REQUIRED_FIELD}`,
    }),

  repeat: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .messages({
      'string.empty': `Повтор пароля ${RegisterMessage.EMPTY_VALUE}`,
      'any.only': RegisterMessage.PASSWORDS_NOT_EQUALS,
      'any.required': `Повтор пароля ${RegisterMessage.REQUIRED_FIELD}`,
    }),

  avatar: Joi.string().allow(null),
});
