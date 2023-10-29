const userSchema = require("../models/users.js");
const {userJOI}  = require('../schemas.js');
const HandleError = require("../utils/ExpressError.js");
const User = new userSchema();

module.exports.validateJOI = (req , res , next) => {
  const {error} = userJOI.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    res.locals.sserr = msg;
    next()
  }
  else{
    next();
  }
}



module.exports.getSignUp = (req, res) => {
  res.render("pages/Authentication_signup");
};
module.exports.signInRedirect = (req, res) => {
  req.flash("error", "You need to be Signed In");
  res.redirect("/signin");
};
module.exports.postSignUp = async (req, res) => {
  // console.log(JSON.parse(JSON.stringify(req.body.user)), req.file);
  try {
    if(res.locals.sserr){
      req.flash('error' , res.locals.sserr);
      return res.redirect('/signup');
    }
    const { password } = req.body.user;
    console.log(req.body.user);
    const user = new userSchema(req.body.user);
    user.images = {
      url: req.file.path,
      filename: req.file.filename,
    };
    // const result = await user.save();
    const registeredUser = await userSchema.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registered Successfully");
      res.redirect(`/find`);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/signup`);
  }
};
module.exports.getSignIn = (req, res) => {
  res.render("pages/Authentication_signin");
};
module.exports.postSignIn = (req, res) => {
  req.flash("success", "Welcome Back");
  res.redirect(`/find`);
};
module.exports.signOut = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "GoodBye");
    res.redirect("/find");
  });
};
