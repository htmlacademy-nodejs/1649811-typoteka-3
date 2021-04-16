'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const initDb = require(`../lib/init-db`);
const {HttpCode} = require(`../const`);
const {
  mockCategories, mockArticles, mockUsers, mockComments, mockAdmin,
} = require(`../../../data/test-data`);


const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDb, {
    admin: mockAdmin,
    categories: mockCategories,
    users: mockUsers,
    articles: mockArticles,
    comments: mockComments,
  });

  search(app, new DataService(mockDb));
});

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({query: `перестать беспокоиться`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`1 article found`, () => expect(response.body.length).toBe(1));

  test(`Article has title "Как перестать беспокоиться и начать жить"`, () =>
    expect(response.body[0].title).toEqual(`Как перестать беспокоиться и начать жить`));

});

test(`API returns code 404 if nothing is found`, () => {

  return request(app).get(`/search`).query({query: `not found query`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, () => {

  return request(app).get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API returns 404 when method is post`, () => {

  return request(app).post(`/search`)
    .expect(HttpCode.NOT_FOUND);
});
