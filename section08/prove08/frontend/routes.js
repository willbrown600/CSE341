const express = require('express');

const router = express.Router();

const script = require('./script');

router.use('/', script.getData);

module.exports = router;