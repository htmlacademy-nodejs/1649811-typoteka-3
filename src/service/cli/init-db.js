'use strict';

const {ExitCode} = require(`../const`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);
const {
  ADMIN_FIRSTNAME, ADMIN_LASTNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_AVATAR,
} = process.env;


module.exports = {
  name: `--initdb`,
  async run() {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();

      console.info(`Connection to database established`);

      const admin = [ADMIN_FIRSTNAME, ADMIN_LASTNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_AVATAR];

      await initDb(sequelize, {admin, categories: [], users: [], articles: [], comments: []});

      console.info(`Database created`);
      await sequelize.close();
    } catch (err) {
      console.error(err.message);
      process.exit(ExitCode.ERROR);
    }
  },
};
