'use strict';

const express = require(`express`);

const router = new express.Router();

router.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
router.get(`/add`, (req, res) => res.render(`new-post`));
router.get(`/edit/:id`, (req, res) => res.send(req.originalUrl));
router.get(`/:id`, (req, res) => res.render(`post`));

module.exports = router;
