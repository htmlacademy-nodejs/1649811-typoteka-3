'use strict';

const express = require(`express`);

const router = new express.Router();

router.get(`/`, (req, res) => res.render(`all-categories`));

module.exports = router;
