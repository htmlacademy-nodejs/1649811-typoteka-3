'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {describe, test, beforeAll, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const article = require(`./article`);
const user = require(`./user`);
const UserService = require(`../data-service/user`);
const RefreshTokenService = require(`../data-service/refresh-token`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../const`);
const {ArticleMessage} = require(`../const-messages`);
const initDb = require(`../lib/init-db`);
const {
  mockCategories, mockArticles, mockUsers, mockComments, mockArticle, mockAdmin,
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

  article(app, new DataService(mockDB), new CommentService(mockDB));
  user(app, new UserService(mockDB), new RefreshTokenService(mockDB));

  return app;
};

let accessToken;


beforeAll(async () => {
  const app = await createAPI();
  const response = await request(app).post(`/login`).send({
    email: `admin@mail.com`,
    password: `webmaster`,
  });
  ({accessToken} = response.body);
});

describe(`API return a list of all articles`, () => {
  let response;
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);

    // console.log(response.body);

  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  // test(`Count all 5`, () =>
  // expect(response.body.count).toBe(5));

  test(`Returns a list of 5 articles`, () =>
    expect(response.body.articles.length).toBe(5));

});

describe(`API return a list of 2 articles & count 5`, () => {
  let response;
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles?limit=2`);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Count all 5`, () =>
    expect(response.body.count).toBe(5));

  test(`Returns a list of 2 articles`, () =>
    expect(response.body.articles.length).toBe(2));

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
    response = await request(app).post(`/articles`)
      .send({...mockArticle}).set(`Authorization`, `Bearer: ${accessToken}`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created with title "Как по-научному оправдать свою лень?"`, () =>
    expect(response.body.title).toEqual(`Как по-научному оправдать свою лень?`));

  test(`Articles count is changed`, () => request(app).get(`/articles?offset=0`)
    .expect((res) => expect(res.body.count).toBe(6)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = Object.assign({}, mockArticle);
  delete newArticle.fullText;
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });


  test(`Without any required property response code is 400`, async () => {

    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];

      response = await request(app).post(`/articles`)
        .send(badArticle).set(`Authorization`, `Bearer: ${accessToken}`);

      expect(response.statusCode).toBe(400);
      const {errors} = response.body;

      expect(errors[key]).toContain(`Поле обязательно для заполнения.`);
    }
  });
});

describe(`API changes existent article if data is valid`, () => {
  const updatedArticle = {...mockArticle};
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });


  test(`Status code 200`, async () =>
    await request(app).put(`/articles/1`)
      .send(updatedArticle)
      .set(`Authorization`, `Bearer: ${accessToken}`)
      .expect(HttpCode.OK),
  );


  test(`Article is really changed`, async () =>
    await request(app).get(`/articles/1`)
      .expect((res) => expect(res.body.title).toEqual(updatedArticle.title)),
  );

});

describe(`API refuses to update article if title is empty`, () => {
  const invalidArticle = {...mockArticle};
  delete invalidArticle.title;
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).put(`/articles/1`)
      .send(invalidArticle).set(`Authorization`, `Bearer: ${accessToken}`);
  });

  test(`Status code 400`, async () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Error message "title" is required`, async () =>
    expect(response.body.errors).toStrictEqual({title: `Поле обязательно для заполнения.`}));
});

describe(`API refuses to update an article if data is invalid`, () => {
  const updatedArticle = {...mockArticle};
  delete updatedArticle.fullText;
  let app;
  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(updatedArticle)) {
      const badArticle = {...updatedArticle};
      delete badArticle[key];

      const response = await request(app).put(`/articles/1`)
        .send(badArticle).set(`Authorization`, `Bearer: ${accessToken}`);

      expect(response.statusCode).toBe(400);

      const {errors} = response.body;

      expect(errors[key]).toContain(ArticleMessage.REQUIRED_FIELD);
    }
  });

  test(`With announce < 30 response code is 400`, async () => {
    const updArticle = {...updatedArticle};
    updArticle.announce = `123`;

    const response = await request(app).put(`/articles/1`)
      .send(updArticle).set(`Authorization`, `Bearer: ${accessToken}`);

    expect(response.statusCode).toBe(400);
    const {errors} = JSON.parse(response.text);
    expect(errors.announce).toBe(ArticleMessage.MIN_ANNOUNCE_LENGTH);

  });
});

test(`API return status code 404 when trying to change non-existent article`, async () => {
  const newArticle = Object.assign({}, mockArticle);
  const app = await createAPI();

  return request(app)
    .put(`/articles/NO-EXIST`)
    .send(newArticle)
    .set(`Authorization`, `Bearer: ${accessToken}`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes an article`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`)
      .set(`Authorization`, `Bearer: ${accessToken}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body).toEqual(true));

  test(`Articles count is 4 now`, () => request(app).get(`/articles`)
    .expect((res) => expect(res.body.articles.length).toBe(4)));
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NO-EXIST`)
    .set(`Authorization`, `Bearer: ${accessToken}`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API return a list of comments to given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return a list of 3 comments`, () => expect(response.body.length).toBe(3));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {text: `Статья так себе. Это где ж такие красоты?`};
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`)
      .send(newComment).set(`Authorization`, `Bearer: ${accessToken}`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body.text).toEqual(newComment.text));

  test(`Comments count is changed, to equal 4`, () => request(app).get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(4)));
});

describe(`API refuses to create a comment`, () => {
  let app;
  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Should returns status code 400`, async () => {

    return request(app)
      .post(`/articles/1/comments`)
      .send({})
      .set(`Authorization`, `Bearer: ${accessToken}`)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Should return 400 when comment length < 30`, async () => {
    return request(app)
      .post(`/articles/1/comments`)
      .send({text: `123`, userId: 1})
      .set(`Authorization`, `Bearer: ${accessToken}`)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Should return 404 (non-existent article)`, async () => {
    return request(app)
      .post(`/articles/NO-EXIST/comments`)
      .send({text: `Тестовый комментарий`})
      .set(`Authorization`, `Bearer: ${accessToken}`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API correctly deletes a comment`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
    const commentId = response.body[0].id;
    response = await request(app)
      .delete(`/articles/comments/${commentId}`).set(`Authorization`, `Bearer: ${accessToken}`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 2 now`, () => request(app).get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();
  return request(app)
    .delete(`/articles/1/comments/NO-EXIST`)
    .expect(HttpCode.NOT_FOUND)
    .set(`Authorization`, `Bearer: ${accessToken}`);
});

test(`API returns all comments`, async () => {
  const app = await createAPI();
  const response = await request(app).get(`/articles/comments`)
    .set(`Authorization`, `Bearer: ${accessToken}`);

  expect(response.statusCode).toBe(HttpCode.OK);
});
