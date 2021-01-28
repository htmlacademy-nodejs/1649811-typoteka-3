'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const initDb = require(`../lib/init-db`);
const {HttpCode} = require(`../../constants`);

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

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDb, {
    categories: mockCategories,
    users: mockUsers,
    articles: mockArticles,
    comments: mockComments,
  });

  category(app, new DataService(mockDb));
});

describe(`API returns category list`, () => {
  let response;

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

describe(`API returns category list with count articles`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories?count=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return list of 5`, () => expect(response.body.length).toBe(5));

  test(`Each category has 1 article`, () =>
    response.body.forEach((item) => expect(item.count).toBe(1))
  );

});

