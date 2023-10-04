const express = require('express');
const router = express.Router();
//Requirements
const asyncError = require('../utils/AsyncError');
//Controller imports
const fetcher = require('../controllers/codechef');
const helper = require('../controllers/codeforces');
const { fetch } = require('../controllers/API');

router.get('/fetch' , asyncError(fetch));


module.exports = router;
