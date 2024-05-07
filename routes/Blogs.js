const express = require('express');
const router = express.Router();
const {Blogs , formBlogs , postBlogs , likeBtn , deleteBlogs} = require('../controllers/Blogs.js'); 
const asyncError = require('../utils/AsyncError.js');

router.get('/' , Blogs);
// router.get('/' , Blogs.);
router.get('/addNew/:id' , formBlogs);
router.post('/addNew/:id' ,postBlogs );
//Below remaining
router.post('/delete/:blogId' , deleteBlogs);
router.post('/react/:id/:blogId' , likeBtn);


module.exports = router;