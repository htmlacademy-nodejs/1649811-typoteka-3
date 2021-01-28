'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const server = require(`./server`);
const filldb = require(`./fill-db`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [generate.name]: generate,
  [server.name]: server,
  [filldb.name]: filldb,
};

module.exports = {
  Cli,
};
