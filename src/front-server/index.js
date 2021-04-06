'use strict';

const express = require(`express`);
const path = require(`path`);
const dayjs = require(`dayjs`);
const expressSession = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const helmet = require(`helmet`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/category`);
const userRouter = require(`./routes/user`);
const {HttpCode, PUBLIC_DIR, VIEWS_DIR, DEFAULT_PORT, SESSION_NAME} = require(`./const`);
require(`dotenv`).config();

const port = process.env.FRONT_PORT || DEFAULT_PORT;

const app = express();

app.set(`views`, path.resolve(__dirname, VIEWS_DIR));
app.set(`view engine`, `pug`);
app.disable(`x-powered-by`);
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [`'self'`, `'unsafe-inline'`],
        scriptSrc: [`'self'`, `'unsafe-inline'`],
        objectSrc: [`'none'`],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    }),
    helmet.xssFilter()
);
app.use(expressSession({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  name: SESSION_NAME,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000 * 48)
  }
}));
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.locals.dayjs = dayjs;

app.use(`/`, userRouter);
app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});

app.use((err, req, res, _next) => {
  if (err.code === `EBADCSRFTOKEN`) {
    res.status(HttpCode.FORBIDDEN).render(`errors/403`);
  }
  console.error(err.stack);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(port, () =>
  console.log(`Принимаю соединения на порт: ${port}`));
