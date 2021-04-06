'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../const`);
const initDb = require(`../lib/init-db`);
const {
  mockCategories, mockArticles, mockUsers, mockComments, mockArticle
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

  article(app, new DataService(mockDB), new CommentService(mockDB));

  return app;
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
    response = await request(app).post(`/articles`).send({...mockArticle});
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created with title "Как по-научному оправдать свою лень?"`, () =>
    expect(response.body.title).toEqual(`Как по-научному оправдать свою лень?`));

  test(`Articles count is changed`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body).toHaveLength(6)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = Object.assign({}, mockArticle);
  delete newArticle.fullText;


  test(`Without any required property response code is 400`, async () => {

    const app = await createAPI();

    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];

      const response = await request(app).post(`/articles`).send(badArticle);

      expect(response.statusCode).toBe(400);
      const {message} = JSON.parse(response.text);

      expect(message.join(`. `)).toBe(`"${key}" is required`);
    }
  });
});

describe(`API changes existent article if data is valid`, () => {
  const updatedArticle = {...mockArticle};
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

describe(`API refuses to update article if title is empty`, () => {
  const invalidArticle = {...mockArticle};
  delete invalidArticle.title;

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/1`).send(invalidArticle);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Error message "title" is required`, () =>
    expect(response.body.message).toContain(`"title" is required`));
});

describe(`API refuses to update an article if data is invalid`, () => {
  const updatedArticle = {...mockArticle};
  delete updatedArticle.fullText;

  test(`Without any required property response code is 400`, async () => {

    const app = await createAPI();

    for (const key of Object.keys(updatedArticle)) {
      const badArticle = {...updatedArticle};
      delete badArticle[key];

      const response = await request(app).put(`/articles/1`).send(badArticle);

      expect(response.statusCode).toBe(400);

      const {message} = JSON.parse(response.text);

      expect(message.join(`. `)).toBe(`"${key}" is required`);
    }
  });

  test(`With announce < 30 response code is 400`, async () => {

    const app = await createAPI();

    const updArticle = {...updatedArticle};
    updArticle.announce = `123`;

    const response = await request(app).put(`/articles/1`).send(updArticle);

    expect(response.statusCode).toBe(400);
    const {message} = JSON.parse(response.text);
    expect(message.join(`. `)).toBe(`"announce" length must be at least 30 characters long`);

  });
});

test(`API return status code 404 when trying to change non-existent article`, async () => {
  const newArticle = Object.assign({}, mockArticle);
  const app = await createAPI();

  return request(app)
    .put(`/articles/NO-EXIST`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
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
  const newComment = {text: `Статья так себе. Это где ж такие красоты?`, userId: 1};
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

test(`API refuses to create a comment when data empty, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment when comment length < 30, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({text: `123`, userId: 1})
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
