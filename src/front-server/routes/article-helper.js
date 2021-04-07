'use strict';

const {nanoid} = require(`nanoid`);
const multer = require(`multer`);
const he = require(`he`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
const {checkObjProp} = require(`../utils`);
const {UPLOAD_DIR} = require(`../const`);

const dayjs = require(`dayjs`).extend(customParseFormat);


const emptyArticle = {
  title: ``,
  createdAt: new Date().toISOString(),
  announce: ``,
  fullText: ``,
  categories: [],
  picture: ``,
};


const getRequestData = (request) => {
  const {body, file} = request;

  const isPictureExist = checkObjProp(file, `filename`);

  const articleData = {
    title: he.escape(body.title),
    createdAt: dayjs(body.login, `DD.MM.YYYY HH:mm`).format(),
    announce: he.escape(body.announce),
    fullText: he.escape(body[`full-text`]),
    categories: Array.isArray(body.categories) ? body.categories : [],
    picture: isPictureExist ? file.filename : body[`old-picture`],
  };

  return [isPictureExist, articleData];
};

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});

const upload = multer({storage});

module.exports = {
  emptyArticle,
  getRequestData,
  upload,
};
