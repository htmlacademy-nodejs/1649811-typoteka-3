'use strict';

const express = require(`express`);
const path = require(`path`);
const dayjs = require(`dayjs`);
const connectTimeout = require(`connect-timeout`);
const expressSession = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const xXssProtection = require(`x-xss-protection`);

const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/category`);
const userRouter = require(`./routes/user`);
const loggedUser = require(`./middleware/logged-user`);
const csrfError = require(`./middleware/csrf-error`);
const {HttpCode, PUBLIC_DIR, VIEWS_DIR, SESSION_NAME, CONNECT_TIMEOUT, WebSocketEvent} = require(`./const`);
const {FRONT_PORT, SECRET_SESSION, SECRET_COOKIE} = process.env;

const app = express();
const http = require(`http`);
const server = http.createServer(app);
const io = require(`socket.io`)(server);


app.locals.io = io;
app.use(connectTimeout(CONNECT_TIMEOUT));

app.set(`views`, path.resolve(__dirname, VIEWS_DIR));
app.set(`view engine`, `pug`);

app.disable(`x-powered-by`);
app.use(xXssProtection());
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

io.on(`connection`, (socket) => {
  socket.on(WebSocketEvent.MOST_POPULAR, (message) => {
    socket.broadcast.emit(WebSocketEvent.MOST_POPULAR, message);
  });
});

server.listen(FRONT_PORT, () =>
  console.log(`Принимаю соединения на порт: ${FRONT_PORT}`));
