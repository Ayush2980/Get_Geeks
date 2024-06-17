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

// router.post('/register', upload.single('image'),AuthFunc.validateJOI ,asyncError(AuthFunc.postSignUp));
router.post(
  "/uploadImage/:id",
  upload.single("image"),
  async (req, res, next) => {
    var { data } = req.body;
    const { id } = req.params;
    console.log(req.file, data);
    // data.image = req.file;
    // const userDataUpdated = await userSchema.findByIdAndUpdate({_id : id} , {data} , {new : true});
    // res.send({userDataUpdated});
    res.send("Done");
  }
);
router.post(
  "/del",
  (req, res, next) => {
    req.data = 8989898;
    next();
  },
  async (req, res) => {
    // const result = await cloudinary.uploader.destroy(
    //   "GetGeeks/kmj21vnqrkjnuie3sfys"
    // );
    res.send({ data: req.data });
  }
);
router.post("/photo", upload.single("image"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  // const result = await cloudinary.uploader.upload()
  res.send({ img: "Done" });
});
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
