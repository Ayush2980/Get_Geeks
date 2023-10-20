const express = require('express');
const router = express.Router();
const Blogs = require('../controllers/Blogs.js'); 
const asyncError = require('../utils/AsyncError.js');

router.get('/' , Blogs.Blogs);
// router.get('/' , Blogs.);
router.get('/addNew/:id' , Blogs.formBlogs);
router.post('/addNew/:id' ,Blogs.postBlogs );
router.post('/delete/:id/:blogId' , );
router.post('/like/:id/:blogId' , Blogs.likeBtn);
router.post('/unlike/:id/:blogId' , Blogs.unlikeBtn);


module.exports = router;