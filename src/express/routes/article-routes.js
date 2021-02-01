'use strict';

const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const multer = require(`multer`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
const {checkObjProp} = require(`../../utils`);
const {calculatePagination, getTotalPages} = require(`../../utils`);

const dayjs = require(`dayjs`).extend(customParseFormat);
const api = require(`../api`).getApi();

const UPLOAD_DIR = `../upload/img/`;
const PUBLIC_IMG_DIR = `../public/img`;

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

const absoluteUploadDir = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: absoluteUploadDir,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});

const upload = multer({storage});

const router = new express.Router();

router.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;

  const [page, limit, offset] = calculatePagination(req.query);

  const [{count, articles}, category] = await Promise.all([
    await api.getCategoryArticles(id, {limit, offset}),
    await api.getCategory(id),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`article/by-category`, {category, articles, page, totalPages});
});


router.get(`/add`, async (req, res) => {
  const newArticle = Object.assign({}, emptyArticle);
  newArticle.createdDate = new Date();

  const categories = await api.getCategories();

  res.render(`my/post-add`, {article: newArticle, categories});
});

router.post(`/add`, upload.single(`picture`), async (req, res) => {

  const [isPictureExist, articleData] = getRequestData(req);

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);

    // temp
    if (isPictureExist) {
      await fs.copyFile(
          path.resolve(absoluteUploadDir, articleData.picture),
          path.resolve(__dirname, PUBLIC_IMG_DIR, articleData.picture),
      );
    }
  } catch (error) {
    console.error(error.message);

    const categories = await api.getCategories();
    res.render(`my/post-add`, {article: articleData, categories});
  }
});

router.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    await api.getArticle(id),
    await api.getCategories(),
  ]);

  res.render(`my/post-edit`, {article, categories});
});

router.post(`/edit/:id`, upload.single(`picture`), async (req, res) => {
  const {id} = req.params;
  const [isNewImage, articleData] = getRequestData(req);

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);

    // Временно
    if (isNewImage) {
      await fs.copyFile(
          path.resolve(absoluteUploadDir, articleData.picture),
          path.resolve(__dirname, PUBLIC_IMG_DIR, articleData.picture),
      );
    }
  } catch (error) {
    console.error(error.message);

    const categories = await api.getCategories();
    articleData.id = id;
    res.render(`my/post-edit`, {article: articleData, categories});
  }
});

router.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);

  res.render(`article/post`, {article});
});

router.get(`/delete/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    await api.deleteArticle(id);
  } catch (error) {
    console.log(error.message);
  }

  res.redirect(`/my`);
});

module.exports = router;
