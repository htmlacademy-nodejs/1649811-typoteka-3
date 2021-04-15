'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const server = require(`./server`);
const filldb = require(`./fill-db`);
const initdb = require(`./init-db`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [generate.name]: generate,
  [server.name]: server,
  [filldb.name]: filldb,
  [initdb.name]: initdb,
};

module.exports = {
  Cli,
};
