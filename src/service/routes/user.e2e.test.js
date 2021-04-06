'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, beforeEach, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);
const TokenService = require(`../data-service/refresh-token`);
const initDb = require(`../lib/init-db`);
const {HttpCode} = require(`../const`);
const {RegisterMessage} = require(`../const-messages`);
const {mockUser} = require(`../../../data/test-data`);


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {
    categories: [],
    users: [],
    articles: [],
    comments: [],
  });
  const app = express();
  app.use(express.json());

  user(app, new DataService(mockDB), new TokenService(mockDB));

  return app;
};

test(`Should return status code 201`, async () => {
  const app = await createAPI();
  const response = await request(app).post(`/user`).send(mockUser);
  return expect(response.statusCode).toBe(HttpCode.CREATED);
});

describe(`API refuses to create an user if data is invalid`, () => {
  let badUser;
  let app;
  let response;
  let message;

  beforeAll(async () => {
    app = await createAPI();
  });

  beforeEach(() => {
    response = null;
    message = null;
    badUser = {...mockUser};
  });

  test(`Bad firstname`, async () => {
    badUser.firstname = ``;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Имя ${RegisterMessage.EMPTY_VALUE}`);

    badUser.firstname = 123;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Имя ${RegisterMessage.ALPHA_VALUE}`);

    delete badUser.firstname;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Имя ${RegisterMessage.REQUIRED_FIELD}`);
  });

  test(`Bad lastname`, async () => {
    badUser.lastname = ``;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Фамилия ${RegisterMessage.EMPTY_VALUE}`);

    badUser.lastname = 123;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Фамилия ${RegisterMessage.ALPHA_VALUE}`);

    delete badUser.lastname;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Фамилия ${RegisterMessage.REQUIRED_FIELD}`);
  });

  test(`Bad email`, async () => {
    badUser.email = ``;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`email ${RegisterMessage.EMPTY_VALUE}`);

    badUser.email = 123;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(RegisterMessage.WRONG_EMAIL);

    delete badUser.email;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`email ${RegisterMessage.REQUIRED_FIELD}`);
  });

  test(`Bad password`, async () => {
    badUser.password = ``;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Пароль не указано значение. Пароли не совпадают`);

    badUser.password = `23`;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Пароль должен быть не меньше 6 символов. Пароли не совпадают`);

    badUser.password = `123wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Пароль должен быть не больше 20 символов. Пароли не совпадают`);

    delete badUser.password;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(message.join(`. `)).toBe(`Пароль обязательно для заполнения. Пароли не совпадают`);
  });
});

describe(`API refuses to create an user if user exist`, () => {
  const newUser = Object.assign({}, mockUser);
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send(newUser);
  });


  test(`Should return status code 400`, async () => {
    response = await request(app).post(`/user`).send(newUser);
    return expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Should return message "email" already exist`, async () => {
    response = await request(app).post(`/user`).send(newUser);
    return expect(response.body).toStrictEqual({message: [`Пользователь с таким email уже зарегистрирован`]});
  });
});

describe(`Login`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send({...mockUser});
  });

  test(`Should return accessToken & refreshToken`, async () => {
    response = await request(app).post(`/login`).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(`accessToken`);
    expect(response.body).toHaveProperty(`refreshToken`);
  });

  test(`Should return User with email bad@mail.com not found`, async () => {
    response = await request(app).post(`/login`).send({
      email: `bad@mail.com`,
      password: mockUser.password,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({"message": [`User with email bad@mail.com not found`]});
  });

  test(`Should return Wrong password`, async () => {
    response = await request(app).post(`/login`).send({
      email: mockUser.email,
      password: `1234567890`,
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({"message": [`Wrong password`]});
  });
});

describe(`Login bad`, () => {
  let app;
  let response;
  let message;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send({...mockUser});
  });

  test(`Should return 400 and error message`, async () => {
    response = await request(app).post(`/login`).send({
      email: `bad email`,
      password: null,
    });

    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Некорректный email. Пароль обязательно для заполнения`);
  });
});

describe(`Logout`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    await request(app).post(`/user`).send({...mockUser});
  });

  test(`Should return 200`, async () => {
    response = await request(app).post(`/login`).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    const {accessToken, refreshToken} = response.body;

    response = await request(app)
						.delete(`/logout`).send(refreshToken)
						.set(`Authorization`, `Bearer: ${accessToken}`);


    expect(response.statusCode).toBe(200);
  });
});

describe(`Refresh`, () => {
  let app;
  let response;
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    app = await createAPI();
    await request(app).post(`/user`).send({...mockUser});
    response = await request(app).post(`/login`).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    ({accessToken, refreshToken} = response.body);
  });
  
  test(`Should return 400`, async () => {
    response = await request(app).post(`/refresh`).send({});
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Should return 404`, async () => {
    response = await request(app).post(`/refresh`).send({'token': `bad-token`});
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`Should return 200 & accessToken, refreshToken`, () => {
    setTimeout(async () => {
      response = await request(app).post(`/refresh`).send({'token': refreshToken});

      expect(response.statusCode).toBe(HttpCode.OK);
      expect(response.body.accessToken).not.toEqual(accessToken);
      expect(response.body.refreshToken).not.toEqual(refreshToken);
    }, 1000);
  });
});


