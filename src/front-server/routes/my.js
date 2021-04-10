'use strict';

const express = require(`express`);
const {asyncWrapper} = require(`../utils`);
const api = require(`../api`).getApi();
const adminRoute = require(`../middleware/admin-route`);


const router = new express.Router();

router.get(`/`, adminRoute, asyncWrapper(async (req, res) => {
  const {loggedUser} = res.locals;

  const articles = await api.getArticles({userId: loggedUser.id});

  res.render(`admin/main`, {articles});
}));

router.get(`/comments`, adminRoute, asyncWrapper(async (req, res) => {
  try {
    const {accessToken} = res.locals;
    const comments = await api.getComments(accessToken);
    res.render(`admin/comments`, {comments});
  } catch (err) {
    console.log(err);
  }
}));

router.get(`/comments/delete/:id`, adminRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  try {
    const {accessToken} = res.locals;
    await api.deleteComment(id, accessToken);

  } catch (error) {
    console.log(error);
  }

  res.redirect(`/my/comments`);
}));

module.exports = router;
