'use strict';

const {Model} = require(`sequelize`);

const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineUser = require(`./user`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);

class ArticleCategory extends Model {
}

const define = (sequelize) => {

  const Category = defineCategory(sequelize);
  const User = defineUser(sequelize);
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);

  User.hasMany(Article, {
    as: Alias.ARTICLES,
    foreignKey: `userId`,
    onDelete: `CASCADE`,
    onUpdate: `CASCADE`,
  });
  Article.belongsTo(User, {
    as: Alias.USER,
  });

  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `userId`,
    onDelete: `CASCADE`,
    onUpdate: `CASCADE`,
  });
  Comment.belongsTo(User, {
    as: Alias.USER,
  });

  ArticleCategory.init({}, {
    sequelize,
    tableName: `articles_categories`,
  });

  Article.belongsToMany(Category, {
    as: Alias.CATEGORIES,
    through: ArticleCategory,
    foreignKey: `articleId`,
  });
  Category.belongsToMany(Article, {
    as: Alias.ARTICLES,
    through: ArticleCategory,
    foreignKey: `categoryId`,
  });
  // Category.hasMany(OfferCategory, {as: Alias.OFFER_CATEGORIES});

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `CASCADE`,
    onUpdate: `CASCADE`,
  });
  Comment.belongsToMany(Article, {
    foreignKey: `articleId`,
  });

  return {Category, User, Article, Comment};
};

module.exports = define;
