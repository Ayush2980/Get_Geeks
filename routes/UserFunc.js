const express = require('express');
const router = express.Router();
const UserFunct = require('../controllers/UserFunc');
//Requirements
const asyncError = require('../utils/AsyncError');
const userSchema = require('../models/users.js');


router.get('/find' , UserFunct.find);
router.post('/addFriend/:id/:friendId' , asyncError(UserFunct.addFriend))
router.get('/users/:id' , asyncError(UserFunct.users));
router.post('/Cfstalk/:id/:username' , asyncError(UserFunct.AddToStalkListCF))
router.post('/Ccstalk/:id/:username' , asyncError(UserFunct.AddToStalkListCC))
router.get('/delete/:id/:username' , asyncError(UserFunct.removeFromStalkList))
router.get('/stalklist/:id' , asyncError(UserFunct.showStalkList))
//Friend addition and removal routes
router.post('/sendReq/:id/:friendID' , asyncError(UserFunct.sendFriendRequest))
router.post('/accept/:id/:friendId' , asyncError(UserFunct.acceptFriendRequest))
router.post('/reject/:id/:friendId' , asyncError(UserFunct.rejectRequest))
router.post('/removeFriend/:id/:friendID' , asyncError(UserFunct.removeFriend))
//Profile view
router.get('/profile/:id' , asyncError(UserFunct.showProfile))



module.exports = router;