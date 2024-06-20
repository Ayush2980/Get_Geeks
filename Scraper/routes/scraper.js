const express = require("express");
const router = express.Router();
//Requirements
const asyncError = require("../utils/AsyncError");
const { fetch, justData } = require("../controllers/API");

router.get("/getSvg", asyncError(fetch));
router.get("/justData", justData);

module.exports = router;
