'use strict';

const express = require(`express`);

const router = new express.Router();

router.get(`/`, (req, res) => res.send(`${req.originalUrl}`));

module.exports = router;
