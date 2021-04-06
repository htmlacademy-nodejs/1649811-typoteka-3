'use strict';

const {beforeAll, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const initDb = require(`../lib/init-db`);
const ArticleService = require(`../data-service/article`);
const {
  mockCategories, mockArticles, mockUsers, mockComments
} = require(`../../../data/test-data`);


const createService = async () => {
  const sequelize = new Sequelize(`sqlite::memory:`, {logging: false});

  await initDb(sequelize, {
    categories: [...mockCategories],
    users: [...mockUsers],
    articles: mockArticles.map((item) => Object.assign({}, item)),
    comments: [...mockComments],
  });

  return new ArticleService(sequelize);
};

describe(`Test ArticleService`, () => {
  let service;
  beforeAll(async () => {
    service = await createService();
  });

  test(`test findPage`, async () => {
    let {count, articles} = await service.findPage({limit: 2, offset: 0});

    expect(count).toBe(mockArticles.length);
    expect(articles).toHaveLength(2);

    ({count, articles} = await service.findPage({limit: 5, offset: 2}));

    expect(articles).toHaveLength(3);

  });
});
