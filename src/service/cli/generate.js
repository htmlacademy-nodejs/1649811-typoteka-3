'use strict';
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {getRandomInt, getRandomDate, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const FILE_OUTPUT = `${__dirname}/../../../mock.json`;
const FILE_TITLE = `${__dirname}/../../../data/title.txt`;
const FILE_CONTENT = `${__dirname}/../../../data/content.txt`;
const FILE_CATEGORY = `${__dirname}/../../../data/category.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DATE_DIFF_MONTH = -3;
const MAX_ANNOUNCE_COUNT = 5;

const getCreatedDate = (diffMonth) => {
  const diffDate = new Date();
  diffDate.setMonth(diffDate.getMonth() + diffMonth);
  return getRandomDate(diffDate.getTime());
};

const readFile = async (filePath) => {
  const content = await fs.readFile(filePath, `utf8`);
  return content.trim().split(`\n`);
};

const generateOffers = (count, titles, content, categories) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getCreatedDate(DATE_DIFF_MONTH),
    announce: shuffle(content).slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT)).join(` `),
    fullText: shuffle(content).slice(0, getRandomInt(1, content.length - 1)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1))
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
    const titles = await readFile(FILE_TITLE);
    const content = await readFile(FILE_CONTENT);
    const categories = await readFile(FILE_CATEGORY);
    const data = JSON.stringify(generateOffers(count, titles, content, categories));
    try {
      await fs.writeFile(FILE_OUTPUT, data);
      console.log(chalk.green(`Данные успешно записаны.`));
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(ExitCode.ERROR);
    }
  }
};
