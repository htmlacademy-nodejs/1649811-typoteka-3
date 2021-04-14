'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);

const FILE_DATA = path.resolve(__dirname, `../../../mocks.json`);

let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILE_DATA, `utf8`);
    data = JSON.parse(fileContent);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
