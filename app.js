require("dotenv").config();
const PORT = 3000;
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const asyncError = require("./utils/AsyncError");
const HandleError = require("./utils/ExpressError");
const { validateUser, protectedRoute } = require("./middleware");
const flash = require("connect-flash");
var session = require("express-session");
const userSchema = require("./models/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage });
const bcrypt = require("bcrypt");
const axios = require("axios");
const http = require("http").createServer(app);
//Middlewares
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(
  session({
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.loggedin = req.user;
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.locals.id = req.user._id;
  } else {
    res.locals.id = undefined;
  }
  res.locals.userType = undefined;
  next();
});

//Mongoose
main()
  .catch((e) => console.log(e))
  .then(() => console.log("Database connected !!!"));
async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@getgeeks.kwk5f8s.mongodb.net/`
  );
}

//Routes
const Auth = require("./routes/Authentication.js");
const API = require("./routes/API.js");
const UserFunc = require("./routes/UserFunc.js");
const Blogs = require("./routes/Blogs.js");
const Community = require("./routes/community.js");

app.use("/", Auth);
app.use("/", API);
app.use("/", UserFunc);
app.use("/Blogs", Blogs);
app.use("/Community", Community);
// app.get("/test", async (req, res) => {
//   const response = await axios.get(
//     "https://getgeeks-5o49.onrender.com/searchCode/barman_ayush"
//   );
//   //response.data.result
//   console.log(response.data);
//   res.send({ success: true, result: JSON.stringify(response.data) });
// });

// // //Just keeping the server alive
// app.get("/areYouAlive", (req, res) => {
//   res.send({ success: true, data: "Si patron , I am Alive !!!" });
// });

// setInterval(async () => {
//   console.log("Sending req");
//   const resposne = await axios.get("https://localhost:3000/areYouAlive");
//   // const resposne = await axios.get("https://getgeeks.onrender.com/areYouAlive");
//   console.lot(resposne.data.data);
// }, 1000);

//Error Handlers
app.all("*", (req, res, next) => {
  next(new HandleError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Some Error Occured", statusCode = 404 } = err;
  res.send({ success: false, msg: message });
  // res.render("pages/Error.ejs", { message, statusCode });
});

http.listen(PORT, () => {
  console.log(`${process.env.BASE_URL}/find`);
});
