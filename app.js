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
const cors = require("cors");
//Middlewares

app.use(
  cors({
    origin: ["http://localhost:3000", "https://getgeeks-5o49.onrender.com"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
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

//Server Hacks
app.get("/AreYouAlive", (req, res) => {
  //This responds to request from scraper
  res.send({
    success: true,
    data: "Node Main Server this side , I am alive , patron !!",
  });
});
setInterval(async () => {
  try {
    const response = await axios.get(
      "https://getgeeks-5o49.onrender.com/AreYouAlive"
    );
    console.log(response.data.success, response.data.data);
  } catch (e) {
    console.log("Scraper Server Died , Please wake him up Patron !!");
  }
}, 10000);

//Error Handlers
app.all("*", (req, res, next) => {
  next(new HandleError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  let { message, statusCode = 404 } = err;
  if (!message) message = "Some Error Occured";
  res.send({ success: false, msg: message });
  // res.render("pages/Error.ejs", { message, statusCode });
});

http.listen(PORT, () => {
  console.log(`${process.env.BASE_URL}/find`);
});
