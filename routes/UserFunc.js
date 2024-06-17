const express = require("express");
const router = express.Router();
const { showProfile, find, editProfile } = require("../controllers/UserFunc");
//Requirements
const asyncError = require("../utils/AsyncError");
const userSchema = require("../models/users.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const { protectedRoute } = require("../middleware.js");
const upload = multer({ storage });

router.get("/find", find);
router.get("/profile/:id", asyncError(showProfile));
router.post("/profile/edit", protectedRoute, upload.single("image"),asyncError(editProfile));

module.exports = router;
