require("dotenv").config();
const PORT = 9000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const HandleError = require("./utils/ExpressError");
const http = require("http").createServer(app);

//cors
app.use(
  cors({
    origin: ["http://localhost:3000", "https://getgeeks.onrender.com/"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
const API = require("./routes/scraper.js");

app.use("/", API);

//Server Hacks
app.get("/AreYouAlive", (req, res) => {
  //This responds to request from scraper
  res.send({
    success: true,
    data: "Scraper Server this side , I am alive , patron !!",
  });
});
setInterval(async () => {
  try {
    const response = await axios.get(
      "https://getgeeks.onrender.com/AreYouAlive"
    );
    console.log(response.data.success, response.data.data);
  } catch (e) {
    console.log("Backend Server Died , Please wake him up Patron !!");
  }
}, 10000);

//Error Handlers
app.all("*", (req, res, next) => {
  next(new HandleError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Some Error Occured", statusCode = 404 } = err;
  res.send({ success: false, msg: message });
});

http.listen(PORT, () => {
  console.log(`${process.env.BASE_URL}${PORT}`);
});
