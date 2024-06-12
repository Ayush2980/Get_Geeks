const userSchema = require("../models/users.js");
const User = new userSchema();
const blogSchema = require("../models/Blogs.js");
const AsyncError = require("../utils/AsyncError.js");
const { fetchForProf } = require("../controllers/codeforces.js");
const { fetchForCCprof } = require("../controllers/codechef.js");
const axios = require("axios");
const {
  getDesignFromRating,
  getNumberFromString,
} = require("../utils/Miscellaneous.js");
const { ObjectId } = require("mongodb");

//Checked
module.exports.find = (req, res) => {
  res.render("pages/Home/homepage");
};
module.exports.addFriend = async (req, res) => {
  if (!(req.params.id != req.user._id) || !req.user)
    throw new Error("You Need Authentication !!");
  const currUser = await userSchema.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { following: req.params.friendId } }
  );
  const friend = await userSchema.findByIdAndUpdate(
    { _id: req.params.friendId },
    { $push: { followers: req.params.id } }
  );
  req.flash("success", "Followed");
  console.log("Done");

  res.redirect("/find");
  // res.redirect(`/profile/${req.params.friendId}`);
};
module.exports.users = async (req, res) => {
  const allUsers = await userSchema.find();
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].id == req.params.id) allUsers.splice(i, 1);
  }
  const currUser = await userSchema
    .findById(req.params.id)
    .populate({ path: "friendList", populate: { path: "friendId" } })
    .populate("pending");
  console.log(currUser.pending);
  res.render("pages/Community/Community.ejs", { allUsers, currUser });
};

//Stalklist management
module.exports.AddToStalkListCF = async (req, res) => {
  const friend = {
    username: req.params.username,
    handle: "CF",
  };
  const id = req.params.id;
  const currUser = await userSchema
    .findByIdAndUpdate({ _id: id }, { $push: { Stalklist: friend } })
    .then(() => console.log("Done Updating "));
  req.flash("success", "Successfully added to Stalklist");
  res.redirect(`/stalklist/${req.params.id}`);
};
module.exports.AddToStalkListCC = async (req, res) => {
  const friend = {
    username: req.params.username,
    handle: "CC",
  };
  const id = req.params.id;
  const currUser = await userSchema
    .findByIdAndUpdate({ _id: id }, { $push: { Stalklist: friend } })
    .then(() => console.log("Done Updating "));
  req.flash("success", "Successfully added to Stalklist");
  res.redirect(`/stalklist/${req.params.id}`);
};
module.exports.removeFromStalkList = async (req, res) => {
  console.log("Heer i am");
  const currUser = await userSchema.findByIdAndUpdate(
    { _id: req.params.id },
    { $pull: { Stalklist: { username: req.params.username } } }
  );
  req.flash("success", "Successfully removed from Stalklist");
  res.redirect(`/stalklist/${req.params.id}`);
};
module.exports.showStalkList = async (req, res) => {
  const { Stalklist } = await userSchema.findById(req.params.id);
  console.log(Stalklist);
  res.render("pages/stalklist.ejs", { Stalklist });
};

//get geeks frined list management
module.exports.sendFriendRequest = async (req, res) => {
  const { id, friendID } = req.params;
  const friend = await userSchema.findByIdAndUpdate(
    { _id: friendID },
    { $push: { pending: { userId: req.user._id, pendingType: 1 } } }
  );
  if (!friend) throw new Error("No such user Exists !!");
  const user = await userSchema.findByIdAndUpdate(
    { _id: req.user._id },
    { $push: { pending: { userId: friendID, pendingType: -1 } } }
  );
  if (!user) throw new Error("Unauthorized access !!");
  req.flash("success", `Friend Request sent to ${friend.username}`);
  res.redirect("/find");
};
module.exports.acceptFriendRequest = async (req, res) => {
  const { id, friendId } = req.params;
  const currUserUpdated = await userSchema.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { pending: { userId: friendId, pendingType: 1 } } },
    { $push: { friends: friendId } }
  );
  if (!currUserUpdated) throw new Error("Unauthorized method called !!");
  const friendUpdated = await userSchema.findByIdAndUpdate(
    { _id: friendId },
    { $pull: { pending: { userId: req.user._id, pendingType: -1 } } },
    { $push: { friends: req.user._id } }
  );
  if (!friendUpdated) throw new Error("Unauthorized method called !!");
  req.flash("success", "Request Accepted");
  res.redirect("/find");
};
module.exports.rejectRequest = async (req, res) => {
  const { id, friendId } = req.params;
  const currUserUpdated = await userSchema.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { pending: { userId: friendId, pendingType: 1 } } }
  );
  if (!currUserUpdated) throw new Error("Unauthorized access !!");
  const friendUpdated = await userSchema.findByIdAndUpdate(
    { _id: friendId },
    { $pull: { pending: { userId: req.user._id, pendingType: -1 } } }
  );
  if (!friendUpdated) throw new Error("Unauthorized access !!");
  req.flash("error", "Request Rejected");
  res.redirect("/find");
};
module.exports.removeFriend = async (req, res) => {
  const { id, friendID } = req.params;
  const currUserUpdated = await userSchema.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { friends: friendID } }
  );
  if (!currUserUpdated) throw new Error("Unauthorized access !!");
  const friendUpdated = await userSchema.findByIdAndUpdate(
    { _id: friendID },
    { $pull: { friends: req.user._id } }
  );
  if (!friendUpdated) throw new Error("Unauthorized access !!");
  req.flash("error", "Friend Removed");
  res.redirect("/find");
};
module.exports.showProfile = async (req, res, next) => {
  try {
    let { id } = req.params;
    console.log(id, typeof id);
    id = new ObjectId(String(id));
    console.log(id, typeof id);
    const currUser = await userSchema.findById(id);
    console.log("Checking the found user ", currUser._id);
    res.render("pages/Profile/profile.ejs", { currUser });
  } catch (e) {
    next(e);
  }
};

module.exports.editProfile = async (req, res) => {
  try {
    if (!req.user) {
      console.log("No user logged in ");
      throw Error("Please Login to continue !!!");
    }
    const {
      fullname = req.user.fullname,
      about = req.user.about,
      linkedIn = req.user.linkedIn,
      pronoun = "He/Him",
    } = req.body;
    const userData = await userSchema.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          fullname: fullname,
          about: about,
          linkedIn: linkedIn,
          pronoun: pronoun,
        },
      },
      { new: true }
    );
    res.send({ success: true, userData });
  } catch (e) {
    const { message = "Some error" } = e;
    console.log(e.message);
    return res.send({ success: false, error: message });
  }
};
