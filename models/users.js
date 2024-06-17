const { number, required } = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    default: " ",
  },
  Email: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: "A Geek",
  },
  pronoun: { type: String, default: "He/Him" },
  country: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
  },
  isCCverified: {
    type: Boolean,
    default: false,
  },
  CCprof: {
    type: String,
  },
  CFprof: {
    type: String,
  },
  image: {
    link: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/122623846?v=4",
    },
    publicId: {
      type: String,
      default: null,
    },
  },
  Stalklist: [
    {
      type: Object,
    },
  ],
  friends: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  token: String,
  pending: [
    {
      userId: {
        type: ObjectId,
        ref: "User",
      },
      pendingType: {
        type: Number,
        required: true,
      },
    },
  ],
  blogs: [
    {
      type: ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
