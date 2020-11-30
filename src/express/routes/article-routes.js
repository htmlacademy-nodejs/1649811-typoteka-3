'use strict';

const express = require(`express`);

const router = new express.Router();

router.get(`/category/:id`, (req, res) => res.send(`${req.originalUrl}`));
router.get(`/add`, (req, res) => res.send(`${req.originalUrl}`));
router.get(`/edit/:id`, (req, res) => res.send(`${req.originalUrl}`));
router.get(`/:id`, (req, res) => res.send(`${req.originalUrl}`));

module.exports = router;
