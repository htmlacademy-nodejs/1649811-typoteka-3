'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, beforeEach, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);
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

  user(app, new DataService(mockDB));

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

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Имя ${RegisterMessage.EMPTY_VALUE}`);

    badUser.firstname = 123;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Имя ${RegisterMessage.ALPHA_VALUE}`);

    delete badUser.firstname;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Имя ${RegisterMessage.REQUIRED_FIELD}`);
  });

  test(`Bad lastname`, async () => {
    badUser.lastname = ``;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Фамилия ${RegisterMessage.EMPTY_VALUE}`);

    badUser.lastname = 123;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Фамилия ${RegisterMessage.ALPHA_VALUE}`);

    delete badUser.lastname;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Фамилия ${RegisterMessage.REQUIRED_FIELD}`);
  });

  test(`Bad email`, async () => {
    badUser.email = ``;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`email ${RegisterMessage.EMPTY_VALUE}`);

    badUser.email = 123;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(RegisterMessage.WRONG_EMAIL);

    delete badUser.email;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`email ${RegisterMessage.REQUIRED_FIELD}`);
  });

  test(`Bad password`, async () => {
    badUser.password = ``;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Пароль не указано значение. Пароли не совпадают`);

    badUser.password = `23`;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Пароль должен быть не меньше 6 символов. Пароли не совпадают`);

    badUser.password = `123wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;
    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
    expect(message.join(`. `)).toBe(`Пароль должен быть не больше 20 символов. Пароли не совпадают`);

    delete badUser.password;

    response = await request(app).post(`/user`).send(badUser);
    ({message} = JSON.parse(response.text));

    expect(response.statusCode).toBe(400);
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
    return expect(response.statusCode).toBe(400);
  });

  test(`Should return message "email" already exist`, async () => {
    response = await request(app).post(`/user`).send(newUser);
    return expect(response.body).toStrictEqual({message: [`Пользователь с таким email уже зарегистрирован`]});
  });
});

describe(`Login`, () => {
  const registerUser = {...mockUser};
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send(registerUser);
  });

  test(`Should return user`, async () => {
    response = await request(app).post(`/login`).send({
      email: registerUser.email,
      password: registerUser.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(registerUser.email);
    expect(response.body.firstname).toBe(registerUser.firstname);
    expect(response.body.lastname).toBe(registerUser.lastname);
    expect(response.body.avatar).toBe(registerUser.avatar);
    expect(response.body.password).toBeUndefined();
  });
});

describe(`Login bad`, () => {
  const registerUser = {...mockUser};
  let app;
  let response;
  let message;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send(registerUser);
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
