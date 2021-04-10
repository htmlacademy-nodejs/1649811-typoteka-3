'use strict';

const path = require(`path`);

const DEFAULT_PORT = 8080;
const PUBLIC_IMG_DIR = path.resolve(__dirname, `public`, `img`);
const UPLOAD_DIR = path.join(__dirname, `upload`);
const PUBLIC_DIR = `public`;
const VIEWS_DIR = `templates`;
const SESSION_NAME = `sid`;
const API_PREFIX = `/api`;
const COOKIE_ACCESS = `user`;
const COOKIE_REFRESH = `token`;
const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};
const UserRole = {
  ADMIN: `admin`,
  READER: `reader`,
};

const ARTICLES_PER_PAGE = 4;
const MAX_ID_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;

const userCookieOption = {signed: true, httpOnly: true, sameSite: `strict`};

const CONNECT_TIMEOUT = `5s`;

module.exports = {
  DEFAULT_PORT,
  ARTICLES_PER_PAGE,
  HttpCode,
  MAX_ID_LENGTH,
  API_PREFIX,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  PUBLIC_DIR,
  VIEWS_DIR,
  SESSION_NAME,
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  userCookieOption,
  PUBLIC_IMG_DIR,
  UPLOAD_DIR,
  UserRole,
  CONNECT_TIMEOUT
};
