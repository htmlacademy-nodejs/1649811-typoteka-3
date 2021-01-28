'use strict';
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {getRandomInt, getRandomDate, shuffle, readFile} = require(`../../utils`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);

const FILE_OUTPUT = `${__dirname}/../../../mocks.json`;
const FILE_TITLES = `${__dirname}/../../../data/titles.txt`;
const FILE_SENTENCES = `${__dirname}/../../../data/sentences.txt`;
const FILE_CATEGORIES = `${__dirname}/../../../data/categories.txt`;
const FILE_COMMENTS = `${__dirname}/../../../data/comments.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DATE_DIFF_MONTH = -3;
const MAX_ANNOUNCE_COUNT = 5;
const MAX_COMMENTS = 4;

const getCreatedDate = (diffMonth) => {
  const diffDate = new Date();
  diffDate.setMonth(diffDate.getMonth() + diffMonth);
  return getRandomDate(diffDate.getTime());
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generatePicture = () => {
  const pictures = [`sea@1x.jpg`, `forest@1x.jpg`, `skyscraper@1x.jpg`];
  return shuffle(pictures).pop();
};

const generateArticles = (count, titles, content, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getCreatedDate(DATE_DIFF_MONTH),
    announce: shuffle(content).slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT)).join(` `),
    fullText: shuffle(content).slice(0, getRandomInt(1, content.length - 1)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    picture: generatePicture(),
  }))
);

module.exports = {
  name: `--generate`,
  async run(arg) {
    const count = Number.parseInt(arg, 10) || DEFAULT_COUNT;
    if (count > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }
    const titles = await readFile(FILE_TITLES);
    const content = await readFile(FILE_SENTENCES);
    const categories = await readFile(FILE_CATEGORIES);
    const comments = await readFile(FILE_COMMENTS);

    const data = JSON.stringify(generateArticles(count, titles, content, categories, comments));
    try {
      await fs.writeFile(FILE_OUTPUT, data);
      console.log(chalk.green(`Данные успешно записаны.`));
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(ExitCode.ERROR);
    }
  },
};
