'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const user = require(`./user`);
const UserService = require(`../data-service/user`);
const RefreshTokenService = require(`../data-service/refresh-token`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const initDb = require(`../lib/init-db`);
const {HttpCode} = require(`../const`);
const {
  mockCategories, mockArticles, mockUsers, mockComments, mockAdmin,
} = require(`../../../data/test-data`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

  await initDb(mockDB, {
    admin: mockAdmin,
    categories: [...mockCategories],
    users: [...mockUsers],
    articles: mockArticles.map((item) => Object.assign({}, item)),
    comments: [...mockComments],
  });

  const app = express();
  app.use(express.json());

  category(app, new DataService(mockDB));
  user(app, new UserService(mockDB), new RefreshTokenService(mockDB));

  return app;
};

const admin = {
  email: `admin@mail.com`,
  password: `webmaster`,
};

let accessToken;
let app;
let response;

beforeAll(async () => {
  app = await createAPI();
  response = await request(app).post(`/login`).send(admin);
  ({accessToken} = response.body);
});


describe(`API returns category list`, () => {
  beforeAll(async () => {
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
  return request(app).get(`/categories/1`)
    .expect(HttpCode.OK);
});

test(`API return all article categories`, async () => {
  response = await request(app).get(`/categories/by-article?articleId=1`);

  expect(response.statusCode).toBe(200);
});

describe(`API returns category list with count articles`, () => {
  beforeAll(async () => {
    response = await request(app).get(`/categories?count=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return list of 5`, () => expect(response.body.length).toBe(5));

  test(`Each category has 5 article`, () =>
    response.body.forEach((item) => expect(item.count).toBe(5)),
  );

});

describe(`API created an category if data is valid`, () => {
  const newCategory = {
    title: `Test new category`,
  };

  beforeAll(async () => {
    response = await request(app).post(`/categories`)
      .send(newCategory).set(`Authorization`, `Bearer: ${accessToken}`);


  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns category created with title "Test category"`, () =>
    expect(response.body.title).toBe(`Test new category`));
});

describe(`API update an category if data is valid`, () => {
  const categoryData = {
    title: `Test update category`,
  };

  beforeAll(async () => {
    response = await request(app).put(`/categories/1`)
      .send(categoryData).set(`Authorization`, `Bearer: ${accessToken}`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns response with data eq "true"`, () =>
    expect(response.body).toBe(true));
});

describe(`API correctly delete an category`, () => {
  beforeAll(async () => {
    response = await request(app)
      .delete(`/categories/1`).set(`Authorization`, `Bearer: ${accessToken}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});
