'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const multer = require(`multer`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
const {checkObjProp} = require(`../../utils`);

const dayjs = require(`dayjs`).extend(customParseFormat);

const UPLOAD_DIR = `../upload/img/`;
const IMAGE_DIR = `../public/img`;

const emptyArticle = {
  title: ``,
  createdAt: new Date().toISOString(),
  announce: ``,
  fullText: ``,
  categories: [],
  picture: ``,
};

const absoluteUploadDir = path.resolve(__dirname, UPLOAD_DIR);

const getRequestData = (request) => {
  const {body, file} = request;

  const isPictureExist = checkObjProp(file, `filename`);

  const articleData = {
    title: body.title,
    createdAt: dayjs(body.login, `DD.MM.YYYY HH:mm`).format(),
    announce: body.announce,
    fullText: body[`full-text`],
    categories: body.categories,
    picture: isPictureExist ? file.filename : body[`old-picture`],
    // temp
    userId: 1,
  };

  return [isPictureExist, articleData];
};

const storage = multer.diskStorage({
  destination: absoluteUploadDir,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});

const upload = multer({storage});

const movePicture = async (picture) => {
  const uploadedFile = path.resolve(absoluteUploadDir, picture);

  await fs.copyFile(
      uploadedFile,
      path.resolve(__dirname, IMAGE_DIR, picture),
  );

  await fs.unlink(uploadedFile);
};

module.exports = {
  emptyArticle,
  getRequestData,
  upload,
  absoluteUploadDir,
  movePicture,
};
