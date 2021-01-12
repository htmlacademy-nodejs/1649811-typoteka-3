'use strict';

const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const multer = require(`multer`);
const {checkObjProp, strDateToISO} = require(`../../utils`);
const api = require(`../api`).getApi();

const UPLOAD_DIR = `../upload/img/`;
const PUBLIC_IMG_DIR = `../public/img`;

const emptyArticle = {
  title: ``,
  createdDate: ``,
  announce: ``,
  fullText: ``,
  category: [],
  picture: ``,
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

router.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

router.get(`/add`, async (req, res) => {
  const newArticle = Object.assign({}, emptyArticle);
  newArticle.createdDate = new Date();

  const categories = await api.getCategories();

  res.render(`post-add`, {article: newArticle, categories});
});

router.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;

  const isPictureExist = checkObjProp(file, `filename`);


  const articleData = {
    title: body.title,
    createdDate: strDateToISO(body.login),
    announce: body.announce,
    fullText: body[`full-text`],
    category: checkObjProp(body, `categories`) ? body.categories : [],
    picture: isPictureExist ? file.filename : body[`old-picture`]
  };

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
    res.render(`post-add`, {article: articleData, categories});
  }
});

router.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    await api.getArticle(id),
    await api.getCategories(),
  ]);

  res.render(`post-edit`, {article, categories});
});

router.post(`/edit/:id`, upload.single(`picture`), async (req, res) => {
  const {id} = req.params;
  const {body, file} = req;

  const isNewImage = checkObjProp(file, `filename`);

  const articleData = {
    title: body.title,
    createdDate: strDateToISO(body.login),
    announce: body.announce,
    fullText: body[`full-text`],
    category: body.categories,
    picture: isNewImage ? file.filename : body[`old-picture`],
  };

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
    res.render(`post-edit`, {article: articleData, categories});
  }
});

router.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);

  res.render(`post`, {article});
});

module.exports = router;
