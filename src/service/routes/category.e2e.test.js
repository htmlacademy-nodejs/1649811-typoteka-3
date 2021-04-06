'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const initDb = require(`../lib/init-db`);
const {HttpCode} = require(`../const`);

const mockCategories = [`Деревья`, `За жизнь`, `Без рамки`, `Разное`, `IT`];
const mockArticles = [
  {
    "title": `Как перестать беспокоиться и начать жить`,
    "announce": `301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Содержание строк остаётся на ваше усмотрение. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  },
];
const mockUsers = [`Иван Иванов ivan@mail.com ivanov`];
const mockComments = [
  `Плюсую, но слишком много буквы! Согласен с автором! Хочу такую же футболку :-)`,
  `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
];


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

  test(`Each category has 1 article`, () =>
    response.body.forEach((item) => expect(item.count).toBe(1)),
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

