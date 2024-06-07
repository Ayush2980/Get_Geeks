if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = 8000;
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const asyncError = require("./utils/AsyncError");
const HandleError = require("./utils/ExpressError");
const { validateUser } = require("./middleware");
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

//Socket.io
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {});

//Middlewares
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static("public"));
//serving the node_modules directory as a static asset
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io-client/dist")
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(
  session({
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    secret: "woot",
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
  await mongoose.connect("mongodb://127.0.0.1:27017/getGeeks");
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

//Error Handlers
app.all("*", (req, res, next) => {
  next(new HandleError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Some Error Occured", statusCode = 404 } = err;
  res.send({ success: false, msg: message });
  // res.render("pages/Error.ejs", { message, statusCode });
});

io.on("connection", (socket) => {
  console.log("User Connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("like-pressed", async (e) => {
    console.log("Pressed the like btn", e);
    const { blogId, userIdLoggedIn, i } = e;
    console.log(blogId, userIdLoggedIn);
    const response = await axios.post(
      `http://localhost:8000/Blogs/react/${userIdLoggedIn}/${blogId}`
    );
    console.log(response.data);
    const { Blog, success = true } = response.data;

    io.emit("liked-data", { success, Blog, userIdLoggedIn, i });
    // io.emit("liked-data", { success : true, userIdLoggedIn , i });
  });
  socket.on("delete-post", async (e) => {
    console.log("server socket caught the delete request");
    const { id } = e;
    console.log(id);

    console.log("Request sent");
    // const { success, msg } = response.data;
    console.log(response.data);
    io.emit("deleted-post", { id });
  });
});

http.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/find`);
});
