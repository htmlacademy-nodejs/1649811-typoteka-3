DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS article_categories CASCADE;
DROP TABLE IF EXISTS tokens;

DROP SEQUENCE IF EXISTS articles_id_seq;
DROP SEQUENCE IF EXISTS categories_id_seq;
DROP SEQUENCE IF EXISTS comments_id_seq;
DROP SEQUENCE IF EXISTS users_id_seq;


CREATE TABLE categories
(
    id    SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE users
(
    id        SERIAL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname  VARCHAR NOT NULL,
    email     VARCHAR NOT NULL UNIQUE,
    password  VARCHAR NOT NULL,
    avatar    VARCHAR DEFAULT '',
    role      VARCHAR DEFAULT 'reader'
);

CREATE TABLE articles
(
    id        SERIAL PRIMARY KEY,
    title     VARCHAR   NOT NULL UNIQUE,
    picture   VARCHAR DEFAULT NULL,
    announce  VARCHAR   NOT NULL,
    "fullText"  TEXT    DEFAULT NULL,
    "createdAt" TIMESTAMP NOT NULL
);

CREATE TABLE comments
(
    id          SERIAL PRIMARY KEY,
    text        TEXT      NOT NULL,
    "createdAt"   TIMESTAMP NOT NULL,
    "userId"    INTEGER   NOT NULL,
    "articleId" INTEGER   NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY ("articleId") REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE article_categories
(
    "articleId"  INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT article_categories_pk PRIMARY KEY ("articleId", "categoryId"),
    FOREIGN KEY ("articleId") REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY ("categoryId") REFERENCES categories (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE tokens
(
    token VARCHAR PRIMARY KEY
);



