'use strict';

const {HttpCode} = require(`../../constants`);

// module.exports = (keys) => (req, res, next) => {
//   const item = req.body;
//   const itemKeys = Object.keys(item);
//   const keysExists = keys.every((key) => itemKeys.includes(key));
//
//   if (!keysExists) {
//     return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
//   }
//
//   return next();
// };


module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;

    try {
      await schema.validateAsync(body, {abortEarly: false});
    } catch (err) {
      const {details} = err;

      res.status(HttpCode.BAD_REQUEST)
        .json({
          message: details.map((errorDescription) => errorDescription.message),
        });

      return;
    }

    next();
  }
);
