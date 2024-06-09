const userSchema = require("../models/users");

module.exports = {
  commPage: async (req, res, next) => {
    try {
      const id = "664788416e491bb512149f34";
      const { Stalklist } = await userSchema.findById({ _id: id });
      return res.render("pages/Community/StalkList.ejs", { Stalklist });
    } catch (e) {
      next(e);
    }
  },
  getStalkList: async (req, res, next) => {
    try {
      const id = "664788416e491bb512149f34";
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
      const { image, name, plat } = req.body;
      //   if (parseInt(id) != parseInt(req.user._id))
      //     throw Error("Unauthorized access!!!");

      //add already added functionality
      const userUpdated = await userSchema.findByIdAndUpdate(
        { _id: id },
        { $push: { Stalklist: { image, name, plat } } },
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
      //   if (parseInt(id) != parseInt(req.user._id))
      //     throw Error("Unauthorized access!!!");
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
