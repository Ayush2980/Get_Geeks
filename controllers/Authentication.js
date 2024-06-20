const { cloudinary } = require("../cloudinary/index.js");
const userSchema = require("../models/users.js");
const { userJOI } = require("../schemas.js");
const HandleError = require("../utils/ExpressError.js");
const User = new userSchema();
const  {getUserName, getFullName} = require("../public/JavaScript/Auth/userSchema.js")

module.exports = {
  validateJOI: (req, res, next) => {
    const { error } = userJOI.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      res.locals.sserr = msg;
      next();
    } else {
      next();
    }
  },
  getSignUp: (req, res) => {
    res.render("pages/Auth/SignUp");
  },
  signInRedirect: (req, res) => {
    req.flash("error", "You need to be Signed In");
    res.redirect("/signin");
  },
  postSignUp: async (req, res) => {
    try {
      if (res.locals.sserr) {
        req.flash("error", res.locals.sserr);
        return res.redirect("/signup");
      }
      const { password } = req.body;
      let userInstance = new userSchema(req.body);
      userInstance.fullname = getFullName(userInstance._id);
      const registeredUser = await userSchema.register(userInstance, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Registered Successfully");
        res.redirect(`/find`);
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect(`/signup`);
    }
  },
  getSignIn: (req, res) => {
    res.render("pages/Auth/SignIn");
  },
  postSignIn: (req, res) => {
    req.flash("success", "Welcome Back");
    res.redirect(`/find`);
  },
  signOut: (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "GoodBye");
      res.redirect("/find");
    });
  },
};
