const express = require('express');
const router = express.Router();
//requirements
const multer = require('multer'); 
const {storage} = require('../cloudinary')
const upload = multer({ storage});
const asyncError = require('../utils/AsyncError');
const userSchema = require('../models/users.js');
const User = new userSchema;
const passport = require('passport');

const AuthFunc = require('../controllers/Authentication.js');

router.get('/signup' , AuthFunc.getSignUp);
router.post('/register'  , upload.single('image') ,asyncError(AuthFunc.postSignUp));
router.get('/signin' ,AuthFunc.getSignIn);
router.get('/signin_redirect?' ,AuthFunc.signInRedirect);
router.post('/signin'  , passport.authenticate('local' , {failureFlash : true , failureRedirect : '/signin'}) , AuthFunc.postSignIn);
router.get('/signout' , AuthFunc.signOut);

module.exports = router;