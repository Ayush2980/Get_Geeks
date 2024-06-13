const userSchema = require("../models/users.js");
const { ObjectId } = require("mongodb");

module.exports = {
  find: (req, res) => {
    res.render("pages/Home/homepage");
  },
  showProfile: async (req, res, next) => {
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
  },

  editProfile: async (req, res) => {
    try {
      if (!req.user) {
        console.log("No user logged in ");
        throw Error("Please Login to continue !!!");
      }
      console.log("Multerrr re bab", req.body);
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
  },
};
