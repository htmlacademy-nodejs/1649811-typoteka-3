'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const initDb = require(`../lib/init-db`);

const mockCategories = [`Деревья`, `За жизнь`, `Без рамки`, `Разное`, `IT`];
const mockArticles = [
  {
    "title": `Как перестать беспокоиться и начать жить`,
    "announce": `301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Содержание строк остаётся на ваше усмотрение. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  },
  {
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Содержание строк остаётся на ваше усмотрение.`,
  },
  {
    "title": `Борьба с прокрастинацией`,
    "announce": `Игры и программирование разные вещи. Содержание строк остаётся на ваше усмотрение.`,
    "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят. Содержание строк остаётся на ваше усмотрение. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  },
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха. Из под его пера вышло 8 платиновых альбомов. 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? 200 OK — успешный запрос. Если клиентом были запрошены какие-либо данные, то они находятся в заголовке и/или теле сообщения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно, как об этом говорят. 301 Moved Permanently — запрошенный документ был окончательно перенесен на новый URI, указанный в поле Location заголовка. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  },
  {
    "title": `Собака Баскервилей`,
    "announce": `Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Содержание строк остаётся на ваше усмотрение. Альбом стал настоящим открытием года.`,
    "fullText": `Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  },
];
const mockUsers = [
  `Иван Иванов ivan@mail.com ivanov`,
  `Светлана Светлакова svetlana@mail.com svetlakova`,
];
const mockComments = [
  `Совсем немного... Мне кажется или я уже читал это где-то?`,
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

  article(app, new DataService(mockDB), new CommentService(mockDB));

  return app;
};

const mockNewArticle = {
  "title": `Как по-научному оправдать свою лень?`,
  "announce": `В этой статье приведем небольшую, с одной стороны шутливую, но с другой стороны полностью научную теорию с помощью которой можно оправдать себя в те моменты, когда над Вами взяла верх лень.`,
  "categories": [1, 2],
  "fullText": `Дело в том, что в физике существует такая термодинамическая величина как энтропия. Её научное значение определяет меру необратимого рассеивания энергии. В других случаях она же может определять вероятность осуществления какого-либо макроскопического состояния...`,
  "userId": 1,
};

describe(`API return a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));

  test(`Last article title equals "Собака Баскервилей"`, () =>
    expect(response.body[4].title).toEqual(`Собака Баскервилей`));

});

describe(`API return a list of all articles with comments`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles?comments=true`);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));

  test(`Each article has 3 comments`, () =>
    response.body.forEach((item) => expect(item.comments.length).toEqual(3)));

});


describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article title is "Как перестать беспокоиться и начать жить"`, () =>
    expect(response.body.title).toEqual(`Как перестать беспокоиться и начать жить`));
});

describe(`API returns an article with comments`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1?comments=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article has 3 comments`, () => expect(response.body.comments).toHaveLength(3));
});

describe(`API created an article if data is valid`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send({...mockNewArticle});
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created with title "Как по-научному оправдать свою лень?"`, () =>
    expect(response.body.title).toEqual(`Как по-научному оправдать свою лень?`));

  test(`Articles count is changed`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body).toHaveLength(6)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newArticle = Object.assign({}, mockNewArticle);
  delete newArticle.fullText;


  test(`Without any required property response code is 400`, async () => {

    const app = await createAPI();

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
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Status code 200`, () =>
    request(app).put(`/articles/1`).send(updatedArticle)
      .expect(HttpCode.OK),
  );


  test(`Article is really changed`, () =>
    request(app).get(`/articles/1`)
      .expect((res) => expect(res.body.title).toEqual(updatedArticle.title)),
  );

});

test(`API return status code 404 when trying to change non-existent article`, async () => {
  const newArticle = Object.assign({}, mockNewArticle);
  const app = await createAPI();

  return request(app)
    .put(`/articles/NO-EXIST`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const invalidArticle = Object.assign({}, mockNewArticle);
  delete invalidArticle.title;
  const app = await createAPI();

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body).toEqual(true));

  test(`Articles count is 4 now`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NO-EXIST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API return a list of comments to given article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return a list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment text equal "Совсем немного... Мне кажется или я уже читал это где-то?"`, () =>
    expect(response.body[0].text).toEqual(`Совсем немного... Мне кажется или я уже читал это где-то?`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {text: `Статья так себе`};
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body.text).toEqual(newComment.text));

  test(`Comments count is changed, to equal 4`, () => request(app).get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NO-EXIST/comments`)
    .send({text: `Тестовый комментарий`})
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
    const commentId = response.body[0].id;
    response = await request(app).delete(`/articles/1/comments/${commentId}`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns true`, () => expect(response.body).toEqual(true));

  test(`Comments count is 2 now`, () => request(app).get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1/comments/NO-EXIST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refused to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NO-EXIST/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
