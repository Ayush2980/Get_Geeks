const userSchema = require("../models/users");
const { ObjectId } = require("mongodb");
module.exports = {
  commPage: async (req, res, next) => {
    try {
      const id = req.user._id;
      const { Stalklist } = await userSchema.findById({ _id: id });
      return res.render("pages/Community/StalkList.ejs", { Stalklist });
    } catch (e) {
      next(e);
    }
  },
  getStalkList: async (req, res, next) => {
    try {
      const id = req.user._id;
      const { Stalklist } = await userSchema.findById({ _id: id });
      console.log(Stalklist);
      // const { Stalklist } = await userSchema.findById({ _id: req.user._id });
      res.send({ success: true, data: Stalklist });
    } catch (e) {
      next(e);
    }
  },
  addToStalkList: async (req, res, next) => {
    try {
      const id = req.user._id;
      let { image, name, plat, userId } = req.body;
      if (!userId) userId = "0";
      const isThere = await userSchema.findById({ _id: id });
      if (isThere.Stalklist.some((obj) => obj.name == name && obj.plat == plat))
        return new Error("Already Added");
      const userUpdated = await userSchema.findByIdAndUpdate(
        { _id: id },
        { $push: { Stalklist: { image, name, plat, userId } } },
        { new: true }
      );
      res.send({ success: true, userUpdated: userUpdated });
    } catch (e) {
      next(e);
    }
  },
  deleteFromStalklist: async (req, res, next) => {
    try {
      console.log("Delete request ");
      const id = req.user._id;
      const { name, plat } = req.body;
      const userUpdated = await userSchema.findByIdAndUpdate(
        { _id: id },
        { $pull: { Stalklist: { name: name, plat: plat } } },
        { new: true }
      );
      res.send({ success: true, userUpdated: userUpdated });
    } catch (e) {
      next(e);
    }
  },
};
