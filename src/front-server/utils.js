'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);

const {ARTICLES_PER_PAGE, UPLOAD_DIR, PUBLIC_IMG_DIR} = require(`./const`);

const checkObjProp = (obj, prop) => {
  return typeof obj === `object` && prop in obj;
};

const readFile = async (filePath) => {
  const content = await fs.readFile(filePath, `utf8`);
  return content.trim().split(`\n`);
};

const getTotalPages = (rowsCount) => {
  return Math.ceil(rowsCount / ARTICLES_PER_PAGE);
};

const calculatePagination = (query) => {
  let {page = 1} = query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  return [page, limit, offset];
};

const asyncWrapper = (callback) => {
  return (req, res, next) => {
    callback(req, res, next)
      .catch(next);
  };
};

const moveUploadedImage = async (image) => {
  const picture = path.join(UPLOAD_DIR, image);
  await fs.copyFile(
      picture,
      path.join(PUBLIC_IMG_DIR, image)
  );

  await fs.unlink(picture);
};

const removeUploadedImage = async (image) => {
  await fs.unlink(path.join(PUBLIC_IMG_DIR, image));
};

module.exports = {
  checkObjProp,
  readFile,
  getTotalPages,
  calculatePagination,
  asyncWrapper,
  moveUploadedImage,
  removeUploadedImage,
};
