'use strict';

const {ExitCode} = require(`../const`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);


module.exports = {
  name: `--initdb`,
  async run() {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();

      console.info(`Connection to database established`);

      const admin = [
        process.env.ADMIN_FIRSTNAME,
        process.env.ADMIN_LASTNAME,
        process.env.ADMIN_EMAIL,
        process.env.ADMIN_PASSWORD,
        process.env.ADMIN_AVATAR,
      ];

      await initDb(sequelize, {admin, categories: [], users: [], articles: [], comments: []});

      console.info(`Database created`);
      await sequelize.close();
    } catch (err) {
      console.error(err.message);
      process.exit(ExitCode.ERROR);
    }
  },
};
