DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS articles_categories CASCADE;


CREATE TABLE categories
(
    id    SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users
(
    id        SERIAL PRIMARY KEY,
    firstname character varying(50)  NOT NULL,
    lastname  character varying(50)  NOT NULL,
    email     character varying(50)  NOT NULL UNIQUE,
    password  character varying(100) NOT NULL,
    avatar    character varying(50)  NOT NULL
);

CREATE TABLE articles
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(250) NOT NULL UNIQUE,
    announce   VARCHAR(250) NOT NULL,
    full_text  TEXT        DEFAULT NULL,
    picture    VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP    NOT NULL,
    user_id    INTEGER      NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE comments
(
    id         SERIAL PRIMARY KEY,
    text       TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id    INTEGER   NOT NULL,
    article_id INTEGER   NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE articles_categories
(
    article_id  INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT article_categories_pk PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



