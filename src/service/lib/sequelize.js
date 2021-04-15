'use strict';

const {Sequelize} = require(`sequelize`);
const {isDevMode} = require(`./logger`);
const {DATABASE_URI} = process.env;

if (!DATABASE_URI) {
  throw new Error(`DATABASE_URI not defined.`);
}

module.exports = new Sequelize(DATABASE_URI, {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  charset: `utf8`,
  collate: `utf8_general_ci`,
  logging: isDevMode ? console.log : false,
});
