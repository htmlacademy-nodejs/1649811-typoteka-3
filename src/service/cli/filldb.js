'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, getRandomDate} = require(`../../utils`);

const FILE_OUTPUT = path.resolve(__dirname, `../../../fill-db.sql`);
const FILE_TITLE = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_SENTENCES = path.resolve(__dirname, `../../../data/sentences.txt`);
const FILE_CATEGORY = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENT = path.resolve(__dirname, `../../../data/comments.txt`);
const FILE_USER = path.resolve(__dirname, `../../../data/users.txt`);

const MAX_COMMENTS = 6;
const DATE_DIFF_MONTH = -3;
const ARTICLES_COUNT = 3;
const MIN_USERS_COUNT = 2;

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const getCreatedDate = (diffMonth) => {
  const diffDate = new Date();
  diffDate.setMonth(diffDate.getMonth() + diffMonth);
  return getRandomDate(diffDate.getTime());
};

const generatePicture = () => {
  const pictures = [`sea@1x.jpg`, `forest@1x.jpg`, `skyscraper@1x.jpg`];
  return shuffle(pictures).pop();
};

const generateArticles = (count, titles, content, maxUserId) => {

  return Array.from({length: count}, (_, i) => {
    const id = i + 1;
    const title = titles[id];
    const announce = shuffle(content).slice(0, getRandomInt(1, 5)).join(` `).slice(0, 250);
    const fullText = shuffle(content).slice(0, getRandomInt(0, content.length - 1)).join(` `);
    const picture = generatePicture();
    const createdAt = getCreatedDate(DATE_DIFF_MONTH).toISOString();
    const userId = getRandomInt(1, maxUserId);

    return `\t(${id}, '${title}', '${announce}', '${fullText}', '${picture}', '${createdAt}', ${userId})`;
  }).join(`,\n`);
};

const generateCategories = (categories) => {
  return categories.map((item, index) => `\t(${index + 1}, '${item}')`).join(`,\n`);
};

const generateUsers = (users, count) => {
  return shuffle(users).slice(0, count)
    .map((item, index) => {
      const [firstname, lastname, email, password] = item.split(` `);
      const id = index + 1;

      return `\t(${id}, '${firstname}', '${lastname}', '${email}', '${password}', 'avatar-${id}.jpg')`;
    }).join(`,\n`);
};

const generateComments = (comments, articlesCount, usersCount) => {
  const values = [];
  const users = shuffle(Array.from({length: usersCount}, (_, i) => i + 1))
    .slice(0, getRandomInt(2, usersCount));

  users.forEach((userId) => {
    for (let i = 1; i <= articlesCount; i++) {
      const countComments = getRandomInt(1, MAX_COMMENTS);

      for (let j = 0; j < countComments; j++) {
        const text = shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `);
        const createdAt = getRandomDate(DATE_DIFF_MONTH).toISOString();

        const entry = `\t(DEFAULT, '${text}', '${createdAt}', ${userId}, ${i})`;
        values.push(entry);
      }
    }
  });

  return values.join(`,\n`);
};

const generateArticlesCategories = (articlesCount, categoriesCount) => {
  const values = [];
  const categoryIds = Array.from({length: categoriesCount}, (_, i) => i + 1);

  for (let i = 1; i <= articlesCount; i++) {
    const articleCategories = shuffle(categoryIds).slice(0, getRandomInt(1, categoriesCount));

    articleCategories.forEach((item) => {
      const entry = `\t(${i}, ${item})`;
      values.push(entry);
    });
  }

  return values.join(`,\n`);
};

const getQuery = (table, values) => {
  const comment = `--\n-- ${table} -\n--`;

  return `${comment}\nINSERT INTO ${table} VALUES\n${values};\n\n`;
};


module.exports = {
  name: `--fill`,
  async run(arg) {
    const titles = await readFile(FILE_TITLE);
    const sentences = await readFile(FILE_SENTENCES);
    const categories = await readFile(FILE_CATEGORY);
    const comments = await readFile(FILE_COMMENT);
    const users = await readFile(FILE_USER);

    const countArticles = Number.parseInt(arg, 10) || ARTICLES_COUNT;
    const countUsers = getRandomInt(MIN_USERS_COUNT, users.length);

    const categoriesValues = generateCategories(categories);
    const usersValues = generateUsers(users, countUsers);
    const articlesValues = generateArticles(countArticles, titles, sentences, countUsers);
    const commentsValues = generateComments(comments, countArticles, countUsers);
    const articlesCategoriesValues = generateArticlesCategories(countArticles, categories.length);

    const queryCategory = getQuery(`categories`, categoriesValues);
    const queryUsers = getQuery(`users`, usersValues);
    const queryArticles = getQuery(`articles`, articlesValues);
    const queryComments = getQuery(`comments`, commentsValues);
    const queryArticlesCategories = getQuery(`articles_categories`, articlesCategoriesValues);

    const data = queryCategory + queryUsers + queryArticles + queryComments + queryArticlesCategories;

    try {
      await fs.writeFile(FILE_OUTPUT, data, `utf8`);

      console.log(chalk.green(`Данные успешно записаны.`));
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(ExitCode.ERROR);
    }
  },
};
