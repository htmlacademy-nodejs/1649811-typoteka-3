'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);
const chalk = require(`chalk`);
const {HttpCode, DEFAULT_PORT} = require(`../../constants`);
const FILE_DATA = `${__dirname}/../../../mock.json`;

const router = new express.Router();
const postsRoute = router.get(`/posts`, (req, res) => {
  fs.readFile(FILE_DATA, `utf8`)
    .then((data) => {
      res.send(JSON.parse(data));
    })
    .catch((err) => {
      res.send([]);
      console.log(err.message);
    });
});

const app = express();
app.use(express.json());

app.use(postsRoute);
app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
});
app.use((err, _req, _res, _next) => {
  console.error(err.stack);
});

module.exports = {
  name: `--server`,
  run: async (arg) => {
    const port = Number.parseInt(arg, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.log(chalk.yellow(`Server listen ${port} port`));
    });
  }
};
