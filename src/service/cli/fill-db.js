'use strict';

const path = require(`path`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, readFile} = require(`../../utils`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);

const FILE_TITLES = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_SENTENCES = path.resolve(__dirname, `../../../data/sentences.txt`);
const FILE_CATEGORIES = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS = path.resolve(__dirname, `../../../data/comments.txt`);
const FILE_USERS = path.resolve(__dirname, `../../../data/users.txt`);

const ARTICLES_COUNT = 5;
const MAX_ANNOUNCE_COUNT = 5;

const pictures = [`sea@1x.jpg`, `forest@1x.jpg`, `skyscraper@1x.jpg`];

const generatePicture = () => {
  return shuffle(pictures).pop();
};

const generateArticles = (count, titles, content) => (
  Array.from({length: count}, (_, i) => (
    {
      title: titles[i],
      announce: shuffle(content).slice(0, getRandomInt(2, MAX_ANNOUNCE_COUNT)).join(` `).slice(0, 250),
      fullText: shuffle(content).slice(0, getRandomInt(1, content.length)).join(` `),
      picture: generatePicture(),
    }
  ))
);

module.exports = {
  name: `--filldb`,
  async run(arg) {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();

      console.info(`Connection to database established`);

      const titles = await readFile(FILE_TITLES);
      const content = await readFile(FILE_SENTENCES);
      const categories = await readFile(FILE_CATEGORIES);
      const comments = await readFile(FILE_COMMENTS);
      const users = await readFile(FILE_USERS);

      const count = Math.min(Number.parseInt(arg, 10) || ARTICLES_COUNT, titles.length);
      const articles = generateArticles(count, titles, content);

      await initDb(sequelize, {categories, users, articles, comments}, true);

      console.info(`Database created and populated`);
      await sequelize.close();

    } catch (err) {
      console.error(err.message);
      process.exit(ExitCode.ERROR);
    }
  }
};