const express = require("express");
const router = express.Router();
const {
  Blogs,
  formBlogs,
  postBlogs,
  likeBtn,
  deleteBlogs,
} = require("../controllers/Blogs.js");
const asyncError = require("../utils/AsyncError.js");
const { protectedRoute } = require("../middleware");

router.get("/", Blogs);
// router.get('/' , Blogs.);
router.get("/addNew/:id", protectedRoute, formBlogs);
router.post("/addNew/:id", protectedRoute, postBlogs);
//Below remaining
router.post("/delete/:blogId", protectedRoute, deleteBlogs);
router.post("/react/:id/:blogId", protectedRoute, likeBtn);

module.exports = router;
