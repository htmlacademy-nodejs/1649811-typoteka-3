'use strict';

const bcrypt = require(`bcrypt`);
const defineModels = require(`../model`);
const {shuffle, getRandomInt, generateCreatedDate} = require(`../utils`);
const {SALT_ROUNDS} = require(`../const`);


const MAX_COMMENTS = 5;
const DIFF_MONTH = 2;

module.exports = async (sequelize, {categories, users, articles, comments}, isRandom = false) => {

  const {Category, User, Article, Comment} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((title) => ({title})),
  );

  const salt = await bcrypt.genSalt(SALT_ROUNDS);

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

    const articleUser = isRandom
      ? userModels[getRandomInt(0, userModels.length - 1)]
      : userModels[0];

    const articleModel = await Article.create(article);
    await articleModel.setUser(articleUser);
    await articleModel.addCategories(articleCategories);

    const articleComments = isRandom
      ? Array.from({length: getRandomInt(2, MAX_COMMENTS)}, () => (
        shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)))
      : comments;

    const articleCommentsPromises = articleComments.map(async (text) => {
      const commentUser = userModels[getRandomInt(0, userModels.length - 1)];

      const commentModel = await Comment.create({
        text,
        createdAt: generateCreatedDate(DIFF_MONTH),
      });
      await commentModel.setUser(commentUser);
      await commentModel.setArticle(articleModel);
    });

    await Promise.all(articleCommentsPromises);

  });

  await Promise.all(articlePromises);
};
