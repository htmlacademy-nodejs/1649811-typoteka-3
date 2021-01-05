'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `ZalgIx`,
    "title": `Собака Баскервилей`,
    "createdDate": `2020-11-15T17:47:06.027Z`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "fullText": `Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `Кино`,
      `Деревья`,
      `Разное`,
      `Поэзия`,
      `Авто`,
      `Железо`,
    ],
    "comments": [
      {
        "id": `U0FWy-`,
        "text": `Совсем немного... Мне кажется или я уже читал это где-то?`,
      },
      {
        "id": `pK-3cH`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`,
      },
      {
        "id": `4zq0qf`,
        "text": `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`,
      },
    ],
  },
  {
    "id": `eqkOpR`,
    "title": `Собака Баскервилей`,
    "createdDate": `2020-12-31T17:01:15.432Z`,
    "announce": `Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Содержание строк остаётся на ваше усмотрение. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "category": [
      `Животные`,
      `Музыка`,
      `IT`,
    ],
    "comments": [
      {
        "id": `InWFss`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "id": `sPzd4O`,
        "text": `Совсем немного... Это где ж такие красоты? Мне кажется или я уже читал это где-то?`,
      },
    ],
  },
  {
    "id": `9kyRIR`,
    "title": `Статус ответа`,
    "createdDate": `2020-12-11T17:46:55.532Z`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Содержание строк остаётся на ваше усмотрение.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. 301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Содержание строк остаётся на ваше усмотрение.`,
    "category": [
      `Разное`,
      `Авто`,
      `Деревья`,
      `Без рамки`,
      `Поэзия`,
      `Железо`,
      `Программирование`,
    ],
    "comments": [
      {
        "id": `hWy3uO`,
        "text": `Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    "id": `5BmVsQ`,
    "title": `Как собрать камни бесконечности`,
    "createdDate": `2020-11-17T21:19:15.243Z`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха. Из под его пера вышло 8 платиновых альбомов. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно, как об этом говорят. 301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "category": [
      `Железо`,
      `Разное`,
    ],
    "comments": [
      {
        "id": `swoAe_`,
        "text": `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`,
      },
      {
        "id": `d8Ad0Y`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`,
      },
      {
        "id": `M7NbIz`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        "id": `6f7Y-G`,
        "text": `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    "id": `Sp8TPN`,
    "title": `Как собрать камни бесконечности`,
    "createdDate": `2020-10-11T23:29:34.032Z`,
    "announce": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "fullText": `Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. 301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "category": [
      `Без рамки`,
      `Деревья`,
      `Животные`,
      `IT`,
      `Кино`,
      `Авто`,
      `Музыка`,
      `Программирование`,
    ],
    "comments": [
      {
        "id": `Qa9Mc8`,
        "text": `Согласен с автором! Плюсую, но слишком много буквы!`,
      },
    ],
  },
];
const mockNewArticle = {
  "title": `Как по-научному оправдать свою лень?`,
  "createdDate": `2021-03-01T14:17:04.305Z`,
  "announce": `В этой статье приведем небольшую, с одной стороны шутливую, но с другой стороны полностью научную теорию с помощью которой можно оправдать себя в те моменты, когда над Вами взяла верх лень.`,
  "category": [`Разное`, `За жизнь`],
  "fullText": `Дело в том, что в физике существует такая термодинамическая величина как энтропия. Её научное значение определяет меру необратимого рассеивания энергии. В других случаях она же может определять вероятность осуществления какого-либо макроскопического состояния...`,
};

const createAPI = () => {
  const articles = mockData.map((item) => Object.assign({}, item));
  const app = express();
  app.use(express.json());
  article(app, new DataService(articles), new CommentService());

  return app;
};

describe(`API return a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`Last article id equals "Sp8TPN"`, () => expect(response.body[4].id).toEqual(`Sp8TPN`));

});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/5BmVsQ`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article title is "Как собрать камни бесконечности"`, () =>
    expect(response.body.title).toEqual(`Как собрать камни бесконечности`));
});

describe(`API created an article if data is valid`, () => {
  const newArticle = Object.assign({}, mockNewArticle);
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newArticle = Object.assign({}, mockNewArticle);
  delete newArticle.fullText;
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {

    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];

      await request(app).post(`/articles`).send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const updatedArticle = {...mockNewArticle};
  updatedArticle.comments = [];
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/eqkOpR`).send(updatedArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(updatedArticle)));

  beforeAll(async () => {
    response = await request(app).get(`/articles/eqkOpR`);
  });

  test(`Article is really changed`, () => expect(response.body.title).toEqual(updatedArticle.title));

  test(`Article comments is empty array`, () => expect(response.body.comments).toStrictEqual([]));
});

test(`API return status code 404 when trying to change non-existent article`, () => {
  const newArticle = Object.assign({}, mockNewArticle);
  const app = createAPI();

  return request(app)
    .put(`/articles/NO-EXIST`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const invalidArticle = Object.assign({}, mockNewArticle);
  delete invalidArticle.title;
  const app = createAPI();

  return request(app)
    .put(`/articles/eqkOpR`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/Sp8TPN`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toEqual(`Sp8TPN`));

  test(`Articles count is 4 now`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NO-EXIST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API return a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/5BmVsQ/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return a list of 4 comments`, () => expect(response.body.length).toBe(4));

  test(`Last comment id equals "6f7Y-G"`, () => expect(response.body[3].id).toEqual(`6f7Y-G`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {text: `Статья так себе`};
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/Sp8TPN/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body.text).toEqual(newComment.text));

  test(`Comments count is changed, to equal 2`, () => request(app).get(`/articles/Sp8TPN/comments`)
    .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/5BmVsQ/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();


  return request(app)
    .post(`/articles/NO-EXIST/comments`)
    .send({text: `Тестовый комментарий`})
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/ZalgIx/comments/U0FWy-`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted comment`, () => expect(response.body.id).toEqual(`U0FWy-`));

  test(`Comments count is 2 now`, () => request(app).get(`/articles/ZalgIx/comments`)
    .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/ZalgIx/comments/NO-EXIST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refused to delete a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NO-EXIST/comments/Qa9Mc8`)
    .expect(HttpCode.NOT_FOUND);
});
