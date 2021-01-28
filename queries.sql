--
-- Получить список всех категорий (идентификатор, наименование категории)
--
SELECT * FROM categories;

--
-- Получить список категорий для которых создана минимум одна публикация
-- (идентификатор, наименование категории)
--
SELECT c.* FROM categories c
    LEFT JOIN articles_categories ac ON c.id = ac."articleId"
GROUP BY c.id;

--
-- Получить список категорий с количеством публикаций
-- (идентификатор, наименование категории, количество публикаций в категории)
--
SELECT c.*, count(ac."articleId") as count_articles FROM categories c
    LEFT JOIN articles_categories ac ON c.id = ac."articleId"
GROUP BY c.id;

--
-- Список публикаций
-- (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации,
--  имя и фамилия автора, контактный email,
--  количество комментариев, наименование категорий).
-- Сначала свежие публикации
--
SELECT a.id, a.title, a.announce, a."createdAt",
       u.firstname, u.lastname, u.email,
       (SELECT count(c.id) FROM comments c WHERE c."articleId" = a.id) as count_comments,
       (SELECT string_agg(ct.title, ', ') FROM categories ct
                                                   INNER JOIN articles_categories ac ON ct.id = ac."categoryId" AND ac."articleId" = a.id) as categories
FROM articles a
         LEFT JOIN users u ON a."userId" = u.id
GROUP BY a.id, u.id, a."createdAt"
ORDER BY a."createdAt" DESC;

--
-- Полная информация определённой публикации
-- (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению,
-- имя и фамилия автора, контактный email,
-- количество комментариев, наименование категорий)
--
SELECT a.id, a.title, a.announce, a."fullText", a."createdAt", a.picture,
       u.firstname, u.lastname, u.email,
       (SELECT count(c.id) FROM comments c WHERE c."articleId" = a.id) as count_comments,
       (SELECT string_agg(ct.title, ', ') FROM categories ct
                                                   JOIN articles_categories ac ON ct.id = ac."categoryId" AND ac."articleId" = a.id) as categories
FROM articles a
         LEFT JOIN users u ON u.id = a."userId"
WHERE a.id = 2;

--
-- Список из 5 свежих комментариев
-- (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария)
--
SELECT c.id, c."articleId", u.firstname, u.lastname, c.text
FROM comments c
         LEFT JOIN users u ON c."userId" = u.id
ORDER BY c."createdAt" DESC
LIMIT 5;

--
-- Список комментариев для определённой публикации
-- (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария).
-- Сначала новые комментарии
--
SELECT c.id, c."articleId", u.firstname, u.lastname, c.text
FROM comments c
         LEFT JOIN users u ON c."userId" = u.id
WHERE c."articleId" = 2
ORDER BY c."createdAt" DESC;

--
-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
--
UPDATE articles SET title = 'Как я встретил Новый год' WHERE articles.id = 3;
