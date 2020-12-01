'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const DEFAULT_PORT = 8080;

const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/article-routes`);
const categoriesRouter = require(`./routes/category-routes`);

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(chalk.red(err.stack));
  res.status(500).send(`Internal server error.`);
};

// eslint-disable-next-line no-unused-vars
const notFoundHandler = (req, res, next) => {
  res.status(404).send(`Page not found.`);
};

const app = express();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(DEFAULT_PORT, () =>
  console.log(chalk.yellow(`Принимаю соединения на порт: ${DEFAULT_PORT}`)));
