const { number } = require("joi");
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
  },
  Email: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  pronoun: { type: String },
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
    type : String    
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
