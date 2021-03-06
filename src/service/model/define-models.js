'use strict';

const {Model} = require(`sequelize`);

const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineUser = require(`./user`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);
const defineRefreshToken = require(`./refresh-token`);

class ArticleCategory extends Model {
}

const define = (sequelize) => {

  const Category = defineCategory(sequelize);
  const User = defineUser(sequelize);
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);
  const RefreshToken = defineRefreshToken(sequelize);


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
    tableName: Alias.ARTICLES_CATEGORIES,
    timestamps: false,
  });

  Article.belongsToMany(Category, {
    as: Alias.CATEGORIES,
    through: ArticleCategory,
    foreignKey: `articleId`,
  });
  Article.hasMany(ArticleCategory, {
    as: Alias.ARTICLE_CATEGORIES,
    foreignKey: `articleId`,
  });

  Category.belongsToMany(Article, {
    as: Alias.ARTICLES,
    through: ArticleCategory,
    foreignKey: `categoryId`,
    onUpdate: `CASCADE`,
    onDelete: `RESTRICT`,
  });

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `CASCADE`,
    onUpdate: `CASCADE`,
  });
  Comment.belongsTo(Article, {
    foreignKey: `articleId`,
  });

  return {Category, User, Article, Comment, RefreshToken};
};

module.exports = define;
