const { userSchema } = require("./schemas");
const HandleError = require("./utils/ExpressError");

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    req.flash("error", msg);
    res.redirect("/signup");
  } else {
    next();
  }
};

module.exports.protectedRoute = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/signin");
    next();
  } catch (e) {
    return next(e);
  }
};
