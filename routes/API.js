const express = require('express');
const router = express.Router();
//Requirements
const asyncError = require('../utils/AsyncError');
//Controller imports
const fetcher = require('../controllers/codechef');
const helper = require('../controllers/codeforces');
const { fetch , justData} = require('../controllers/API');

router.get('/fetch' , asyncError(fetch));
router.get('/justData' , justData);


module.exports = router;
