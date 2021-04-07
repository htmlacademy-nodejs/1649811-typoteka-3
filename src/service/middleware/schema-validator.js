'use strict';

const {HttpCode} = require(`../const`);

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;

    try {
      await schema.validateAsync(body, {abortEarly: false});
    } catch (err) {
      const {details} = err;

      res.status(HttpCode.BAD_REQUEST)
        .json({
          errors: details.reduce((e, item) => {
            const [key] = item.path;
            e[key] = e[key] ? `${e[key]} ${item.message}` : item.message;
            return e;
          }, {})
        });

      return;
    }

    next();
  }
);
