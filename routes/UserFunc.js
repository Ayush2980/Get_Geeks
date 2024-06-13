const express = require("express");
const router = express.Router();
const { showProfile, find, editProfile } = require("../controllers/UserFunc");
//Requirements
const asyncError = require("../utils/AsyncError");
const userSchema = require("../models/users.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/find", find);
router.get("/profile/:id", asyncError(showProfile));
router.post("/profile/edit" ,asyncError(editProfile));

module.exports = router;
