'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required(),

  createdAt: Joi.date()
    .required(),

  announce: Joi.string()
    .min(30)
    .max(250)
    .required(),

  fullText: Joi.string()
    .max(1000),

  categories: Joi.array()
    .items(Joi.number().min(1).required())
    .required(),

  picture: Joi.string()
    .max(255),

  userId: Joi.number()
    .required(),
});

