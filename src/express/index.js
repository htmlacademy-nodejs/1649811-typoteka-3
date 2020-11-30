'use strict';

const express = require(`express`);
const DEFAULT_PORT = 8080;

const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/article-routes`);
const categoriesRouter = require(`./routes/category-routes`);

const app = express();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

app.listen(DEFAULT_PORT);

