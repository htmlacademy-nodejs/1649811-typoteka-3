'use strict';

const bcrypt = require(`bcrypt`);
const defineModels = require(`../model`);
const {shuffle, getRandomInt, generateCreatedDate} = require(`../utils`);
const {SALT_ROUNDS} = require(`../const`);

const MAX_COMMENTS = 5;

module.exports = async (sequelize, {admin, categories, users, articles, comments}, isRandom = false, logging = true) => {

  const {Category, User, Article, Comment} = defineModels(sequelize);

  await sequelize.sync({force: true, logging});

  const categoryModels = await Category.bulkCreate(
      categories.map((title) => ({title})),
  );

  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  const [fName, lName, aEmail, aPass, avatar] = admin.split(` `);
  const adminPass = await bcrypt.hash(aPass, salt);

  await User.create({
    firstname: fName,
    lastname: lName,
    email: aEmail,
    password: adminPass,
    avatar,
    role: `admin`,
  });

  const userModels = await User.bulkCreate(
      await Promise.all(
          users.map(async (item, index) => {
            const [firstname, lastname, email, pass] = item.split(` `);
            const crPass = await bcrypt.hash(pass, salt);
            return {
              firstname,
              lastname,
              email,
              password: crPass,
              avatar: `avatar-${index + 1}.png`,
            };
          }),
      ),
  );

  const articlePromises = articles.map(async (article) => {

    const articleCategories = isRandom
      ? shuffle([...categoryModels]).slice(0, getRandomInt(1, categoryModels.length))
      : categoryModels;

    const articleModel = await Article.create(article);
    await articleModel.addCategories(articleCategories);

    const articleComments = isRandom
      ? Array.from({length: getRandomInt(2, MAX_COMMENTS)}, () => (
        shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)))
      : comments;

    const articleCommentsPromises = articleComments.map(async (text) => {
      const commentUser = userModels[getRandomInt(0, userModels.length - 1)];

      const commentModel = await Comment.create({
        text,
        createdAt: generateCreatedDate(-2),
      });
      await commentModel.setUser(commentUser);
      await commentModel.setArticle(articleModel);
    });

    await Promise.all(articleCommentsPromises);
  });

  await Promise.all(articlePromises);
};
