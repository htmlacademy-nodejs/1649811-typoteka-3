'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const initDb = require(`../lib/init-db`);
const {HttpCode} = require(`../const`);
const {
  mockCategories, mockArticles, mockUsers, mockComments
} = require(`../../../data/test-data`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

  await initDb(mockDB, {
    categories: [...mockCategories],
    users: [...mockUsers],
    articles: mockArticles.map((item) => Object.assign({}, item)),
    comments: [...mockComments],
  });

  const app = express();
  app.use(express.json());

  category(app, new DataService(mockDB));

  return app;
};

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return list of 5`, () => expect(response.body.length).toBe(5));

  test(`Category names are "Деревья", "За жизнь", "Без рамки", "Разное", "IT"`, () =>
    expect(response.body.map((item) => item.title))
      .toEqual(expect.arrayContaining(mockCategories)),
  );

});

test(`API return category with given id`, async () => {
  const app = await createAPI();

  return request(app).get(`/categories/1`)
    .expect(HttpCode.OK);
});

describe(`API returns category list with count articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/categories?count=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return list of 5`, () => expect(response.body.length).toBe(5));

  test(`Each category has 5 article`, () =>
    response.body.forEach((item) => expect(item.count).toBe(5)),
  );

});

describe(`API created an category if data is valid`, () => {
  let response;

  const newCategory = {
    title: `Test new category`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/categories`).send(newCategory);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns category created with title "Test category"`, () =>
    expect(response.body.title).toBe(`Test new category`));
});

describe(`API update an category if data is valid`, () => {
  let response;

  const categoryData = {
    title: `Test update category`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).put(`/categories/1`).send(categoryData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns response with data eq "true"`, () =>
    expect(response.body).toBe(true));
});

describe(`API correctly delete an category`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).delete(`/categories/1`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns response with data eq "true"`, () =>
    expect(response.body).toBe(true));
});

