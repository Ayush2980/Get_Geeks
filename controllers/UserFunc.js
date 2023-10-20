const userSchema = require('../models/users.js');
const User = new userSchema;



module.exports.find = (req , res) => {
    res.render('pages/homepage')
}
module.exports.profile = async(req , res) => {
    const currUser = await userSchema.findById(req.params.id);
    console.log(currUser);
    // const userDataCC = await fetcher.searchCode(currUser.CCprof);
    // const userData = await helper.searchCF(currUser.CFprof);
    // res.render('pages/profile.ejs' , {currUser , userData , userDataCC});
    res.send(currUser);   
}
module.exports.addFriend = async(req , res) => {
    const currUser = await userSchema.findByIdAndUpdate({_id : req.params.id} , {$push : {following : req.params.friendId}});
    const friend = await userSchema.findByIdAndUpdate({_id : req.params.friendId} , {$push : {followers : req.params.id}});
    req.flash('success' , 'Followed');console.log("Done")

    res.redirect('/find');
    // res.redirect(`/profile/${req.params.friendId}`);
}
module.exports.users = async(req ,res) => {
    const allUsers = await userSchema.find();
    for(var i =0; i < allUsers.length ;i++){
      if(allUsers[i].id == req.params.id) allUsers.splice(i , 1);
    }
    const currUser = await userSchema.findById(req.params.id).populate({path : 'friendList' , populate : {path : 'friendId'}}).populate('pending');
    console.log(currUser.pending);
    res.render('pages/Alluser.ejs' , {allUsers,currUser});
  }
module.exports.AddToStalkListCF = async(req ,res) => {
    const friend = {
      username : req.params.username,
      handle : "CF"
    }
    const id = req.params.id;
    const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$push : {Stalklist : friend}}).then(() => console.log("Done Updating "))
    req.flash('success' , 'Successfully added to Stalklist')
    res.redirect(`/stalklist/${req.params.id}`);
  }
module.exports.AddToStalkListCC = async(req ,res) => {
    const friend = {
      username : req.params.username,
      handle : "CC"
    }
    const id = req.params.id;
    const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$push : {Stalklist : friend}}).then(() => console.log("Done Updating "))
    req.flash('success' , 'Successfully added to Stalklist');
    res.redirect(`/stalklist/${req.params.id}`);
}
module.exports.removeFromStalkList = async(req , res) => {
    console.log("Heer i am");
    const currUser = await userSchema.findByIdAndUpdate({_id : req.params.id} , {$pull : {Stalklist : {username : req.params.username}}});
    req.flash('success' , 'Successfully removed from Stalklist')
    res.redirect(`/stalklist/${req.params.id}`);
    
  }
module.exports.showStalkList = async(req , res) => {
    const {Stalklist} = await userSchema.findById(req.params.id);
    console.log(Stalklist)
    res.render('pages/stalklist.ejs' , {Stalklist});
}
module.exports.sendFriendRequest = async(req, res) => {
    const {id , friendID} = req.params;
    const friend = await userSchema.findByIdAndUpdate({_id : friendID} , {$push : {pending : id}});
    const friendReq = {
      friendId : friendID,
      status : -1
    }
    const user = await userSchema.findByIdAndUpdate({_id : id} , {$push : {friendList : friendReq}});
    req.flash('success' , `Frined Request sent to ${friend.username}`);
    res.redirect('/find');
}
module.exports.acceptFriendRequest = async(req  , res) => {
    const {id , friendId} = req.params;
    const friend = {
      friendId : friendId,
      status : 1
    }
    const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$pull : {pending : friendId} , $push : {friendList : friend}});
    const friendData = await userSchema.findByIdAndUpdate({_id : friendId} , {$set : {friendList : {friendId : id , status : 1}} })
    req.flash('success' , 'Request Accepted');
    res.redirect('/find');
}
module.exports.rejectRequest = async(req , res) => {
    const {id , friendId} = req.params;
    const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$pull : {pending : friendId}});
    const friendData = await userSchema.findByIdAndUpdate({_id : friendId} , {$pull : {friendList : {friendId : id}}})
    req.flash('error' , 'Request Rejected');
    res.redirect('/find');
}
module.exports.removeFriend = async(req , res) => {
    const {id , friendID} = req.params;
    const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$pull : {friendList : {friendId : friendID}}});
    const friendData = await userSchema.findByIdAndUpdate({_id : friendID} , {$pull : {friendList : {friendId : id}}})
    req.flash('error' , 'Friend Removed');
    res.redirect('/find');
  
}