'use strict';

const fs = require(`fs`).promises;

const {ARTICLES_PER_PAGE} = require(`./constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }
  return someArray;
};

const getRandomDate = (startTime) => {
  const currentTime = Date.now();
  const time = (startTime > currentTime)
    ? getRandomInt(currentTime, startTime)
    : getRandomInt(startTime, currentTime);
  return new Date(time);
};

const checkObjProp = (obj, prop) => {
  return typeof obj === `object` && prop in obj;
};

const readFile = async (filePath) => {
  const content = await fs.readFile(filePath, `utf8`);
  return content.trim().split(`\n`);
};

const generateCreatedDate = (diffMonth) => {
  const diffDate = new Date();
  diffDate.setMonth(diffDate.getMonth() + diffMonth);
  return getRandomDate(diffDate.getTime());
};

const getTotalPages = (rowsCount) => {
  return Math.ceil(rowsCount / ARTICLES_PER_PAGE);
};

const calculatePagination = (query) => {
  let {page = 1} = query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  return [page, limit, offset];
};

module.exports = {
  getRandomInt,
  getRandomDate,
  shuffle,
  checkObjProp,
  readFile,
  generateCreatedDate,
  getTotalPages,
  calculatePagination,
};
