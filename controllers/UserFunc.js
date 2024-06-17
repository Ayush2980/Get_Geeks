const userSchema = require("../models/users.js");
const { ObjectId } = require("mongodb");
const { cloudinary } = require("../cloudinary/index.js");

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
      console.log("Checking image there ot not ", req.file);
      const {
        fullname = req.user.fullname,
        about = req.user.about,
        linkedIn = req.user.linkedIn,
        pronoun = "He/Him",
      } = req.body;
      let image = req.user.image;
      if (req.file) {
        image = {
          link: req.file.path,
          publicId: req.file.filename,
        };
        //if Some data for image has been sent
        if (req.user.image.publicId) {
          // default is not there then delete
          try {
            const result = await cloudinary.uploader.destroy(
              req.user.image.publicId
            );
          } catch (e) {
            next(e);
          }
        }
      }
      const userData = await userSchema.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            fullname: fullname,
            about: about,
            linkedIn: linkedIn,
            pronoun: pronoun,
            image: image,
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
