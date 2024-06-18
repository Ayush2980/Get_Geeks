const express = require("express");
const router = express.Router();
const axios = require("axios");
//requirements
const { cloudinary } = require("../cloudinary/index.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const asyncError = require("../utils/AsyncError");
const userSchema = require("../models/users.js");
const User = new userSchema();
const passport = require("passport");
const {
  getSignIn,
  getSignUp,
  signInRedirect,
  signOut,
  postSignIn,
  postSignUp,
  validateJOI,
} = require("../controllers/Authentication.js");
router.get("/signup", getSignUp);
router.get("/signin", getSignIn);
router.get("/signin_redirect?", signInRedirect);
router.get("/signout", signOut);
router.post(
  "/signin",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/signin",
  }),
  postSignIn
);
router.post("/register", validateJOI, asyncError(postSignUp));
module.exports = router;
