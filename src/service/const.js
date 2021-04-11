'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const ARTICLES_PER_PAGE = 4;

const SALT_ROUNDS = 6;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

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

const MAX_ID_LENGTH = 6;

const API_PREFIX = `/api`;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;

const JWT_EXPIRES = `15m`;

const LAST_COMMENTS_LIMIT = 4;
const MOST_POPULAR_LIMIT = 4;

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_PORT,
  USER_ARGV_INDEX,
  ARTICLES_PER_PAGE,
  ExitCode,
  HttpCode,
  MAX_ID_LENGTH,
  API_PREFIX,
  Env,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  SALT_ROUNDS,
  JWT_EXPIRES,
  LAST_COMMENTS_LIMIT,
  MOST_POPULAR_LIMIT,
  UserRole,
};
