const express = require("express");
const router = express.Router();
//Requirements
const asyncError = require("../utils/AsyncError");
const { getsvg } = require("../controllers/codeforces.js");
const { searchCode } = require("../controllers/codechef.js");

router.get("/getSvg/:user", asyncError(getsvg));
router.get("/searchCode/:user", searchCode);

module.exports = router;

// getSvg
// codechef :: searchCode
