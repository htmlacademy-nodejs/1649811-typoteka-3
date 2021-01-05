'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `TugSxZ`,
    "title": `Как перестать беспокоиться и начать жить`,
    "createdDate": `2020-10-05T05:59:05.221Z`,
    "announce": `301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Содержание строк остаётся на ваше усмотрение. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `Кино`,
      `Авто`,
      `Программирование`,
      `Деревья`,
    ],
    "comments": [
      {
        "id": `D75TFT`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором! Хочу такую же футболку :-)`,
      },
    ],
  },
  {
    "id": `Qd3VVT`,
    "title": `Ёлки. История деревьев`,
    "createdDate": `2020-12-18T12:10:25.368Z`,
    "announce": `Собрать камни бесконечности легко, если вы прирожденный герой. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Содержание строк остаётся на ваше усмотрение.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Содержание строк остаётся на ваше усмотрение. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха.`,
    "category": [
      `Животные`,
      `IT`,
      `Кино`,
      `Поэзия`,
      `Железо`,
      `Авто`,
      `Деревья`,
      `Программирование`,
      `Сеть`,
      `Музыка`,
    ],
    "comments": [
      {
        "id": `mJL6lh`,
        "text": `Совсем немного...`,
      },
      {
        "id": `MvOLzC`,
        "text": `Плюсую, но слишком много буквы!`,
      },
    ],
  },
  {
    "id": `pJL2Gp`,
    "title": `Собака Баскервилей`,
    "createdDate": `2020-12-05T06:22:49.324Z`,
    "announce": `Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов.`,
    "fullText": `Как начать действовать? Для начала просто соберитесь.`,
    "category": [
      `Сеть`,
      `Без рамки`,
      `Программирование`,
      `Авто`,
      `Поэзия`,
      `Кино`,
      `За жизнь`,
      `Разное`,
      `Музыка`,
      `Железо`,
      `Деревья`,
      `IT`,
    ],
    "comments": [
      {
        "id": `2RstaX`,
        "text": `Мне кажется или я уже читал это где-то?`,
      },
      {
        "id": `oaBRwT`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
      },
      {
        "id": `qQTMgi`,
        "text": `Мне кажется или я уже читал это где-то?`,
      },
      {
        "id": `Bnmhnv`,
        "text": `Это где ж такие красоты? Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`,
      },
    ],
  },
  {
    "id": `QplNhZ`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "createdDate": `2020-10-28T11:26:17.062Z`,
    "announce": `Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов.`,
    "category": [
      `Музыка`,
      `Поэзия`,
      `Животные`,
      `Программирование`,
      `IT`,
      `За жизнь`,
    ],
    "comments": [
      {
        "id": `maJfXZ`,
        "text": `Планируете записать видосик на эту тему?`,
      },
      {
        "id": `y5M9NW`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)`,
      },
      {
        "id": `ps41fE`,
        "text": `Плюсую, но слишком много буквы! Совсем немного... Хочу такую же футболку :-)`,
      },
      {
        "id": `HyoVp9`,
        "text": `Мне кажется или я уже читал это где-то?`,
      },
    ],
  },
  {
    "id": `xOaNHB`,
    "title": `Лучшие рок-музыканты 20-века`,
    "createdDate": `2020-11-21T21:51:38.328Z`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Содержание строк остаётся на ваше усмотрение. 301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "category": [
      `Кино`,
      `Сеть`,
    ],
    "comments": [
      {
        "id": `b_VH9v`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`,
      },
      {
        "id": `eOuPht`,
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
      },
      {
        "id": `eVN0fQ`,
        "text": `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  },
];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return list of 13`, () => expect(response.body.length).toBe(13));

  test(
      `Category names are "Деревья", "За жизнь", "Без рамки", "Разное", "IT", "Музыка", "Кино",
  "Программирование", "Железо", "Животные", "Поэзия", "Авто", "Сеть"`,
      () => expect(response.body).toEqual(expect.arrayContaining([
        `Деревья`, `За жизнь`, `Без рамки`, `Разное`,
        `IT`, `Музыка`, `Кино`, `Программирование`,
        `Железо`, `Животные`, `Поэзия`, `Авто`, `Сеть`,
      ])),
  );

});