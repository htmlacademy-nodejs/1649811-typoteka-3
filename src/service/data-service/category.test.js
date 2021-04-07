'use strict';

const {beforeAll, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const initDb = require(`../lib/init-db`);
const CategoryService = require(`../data-service/category`);
const {mockCategories, mockArticles} = require(`../../../data/test-data`);


const createService = async () => {
  const sequelize = new Sequelize(`sqlite::memory:`, {logging: false});

  await initDb(sequelize, {
    categories: [...mockCategories],
    users: [],
    articles: mockArticles.slice(0, 3).map((item) => Object.assign({}, item)),
    comments: [],
  });

  return new CategoryService(sequelize);
};

describe(`DataService Category test`, () => {
  let service;
  beforeAll(async () => {
    service = await createService();
  });

  test(`test findAllOnlyHavingArticles()`, async () => {

    const categories = await service.findAllOnlyHavingArticles();
    expect(categories).toHaveLength(5);
    for (const category of categories) {
      expect(category.count).toBe(3);
    }
  });
});