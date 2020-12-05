'use strict';

const express = require(`express`);

const router = new express.Router();

router.get(`/`, (req, res) => res.render(`my`));
router.get(`/comments`, (req, res) => res.render(`comments`));

module.exports = router;
