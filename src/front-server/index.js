'use strict';

const express = require(`express`);
const path = require(`path`);
const dayjs = require(`dayjs`);
const connectTimeout = require(`connect-timeout`);
const expressSession = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const helmet = require(`helmet`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/category`);
const userRouter = require(`./routes/user`);
const loggedUser = require(`./middleware/logged-user`);
const csrfError = require(`./middleware/csrf-error`);
const {HttpCode, PUBLIC_DIR, VIEWS_DIR, SESSION_NAME, CONNECT_TIMEOUT} = require(`./const`);
const {FRONT_PORT, SECRET_SESSION, SECRET_COOKIE} = process.env;

const app = express();
app.use(connectTimeout(CONNECT_TIMEOUT));

app.set(`views`, path.resolve(__dirname, VIEWS_DIR));
app.set(`view engine`, `pug`);

app.disable(`x-powered-by`);
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [`'self'`],
        scriptSrc: [`'self'`],
        imgSrc: [`'self'`, `blob:`, `data:`],
        objectSrc: [`'none'`],
        upgradeInsecureRequests: [],
      },
      reportOnly: true,
    }),
    helmet.xssFilter()
);
app.use(expressSession({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  name: SESSION_NAME,
  cookie: {
    sameSite: true,
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000 * 24)
  }
}));
app.use(cookieParser(SECRET_COOKIE));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.locals.dayjs = dayjs;

app.use(loggedUser);

app.use(`/`, userRouter);
app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);


app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});

app.use(csrfError);

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(FRONT_PORT, () =>
  console.log(`Принимаю соединения на порт: ${FRONT_PORT}`));
