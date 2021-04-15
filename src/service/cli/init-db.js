'use strict';

const path = require(`path`);
const {ExitCode} = require(`../const`);
const {readFile} = require(`../utils`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);

const FILE_ADMIN = path.resolve(__dirname, `../../../data/admin.txt`);


module.exports = {
  name: `--initdb`,
  async run() {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();

      console.info(`Connection to database established`);

      const [admin] = await readFile(FILE_ADMIN);

      await initDb(sequelize, {admin, categories: [], users: [], articles: [], comments: []}, false, false);

      console.info(`Database created`);
      await sequelize.close();

      const [,, email, password] = admin.split(` `);
      console.log(`Admin:`);
      console.log(`email: ${email}`, `password: ${password}`);

    } catch (err) {
      console.error(err.message);
      process.exit(ExitCode.ERROR);
    }
  },
};
