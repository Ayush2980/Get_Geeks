if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const  bodyParser = require('body-parser');
const asyncError = require('./utils/AsyncError');
const HandleError = require('./utils/ExpressError');
const {validateUser} = require('./middleware');
const flash = require('connect-flash');
var session = require('express-session');
const userSchema = require('./models/users.js');
const passport = require('passport');
const LocalStrategy =  require('passport-local');
const multer = require('multer'); 
const {storage} = require('./cloudinary')
const upload = multer({ storage});


//Middlewares
app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , './views'));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(flash());
app.use(session({ cookie: { maxAge: 60000 }, secret: 'woot',resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

app.use((req ,res , next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.loggedin = req.user;
  if(req.isAuthenticated()){
    res.locals.id = req.user._id;
  }
  else{
    res.locals.id = undefined;
  }
  res.locals.userType = undefined;
  next();
})




//Mongoose
main().catch(e => console.log(e)).then(() => console.log("Database connected !!!"));
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/getGeeks');
}





//Routes
const Auth = require('./routes/Authentication.js');
const API  = require('./routes/API.js');
const UserFunc = require('./routes/UserFunc.js');

app.use('/' , Auth);
app.use('/' , API);
app.use('/' , UserFunc);

//Error Handlers
app.all('*' , (req , res , next) => {
  next(new HandleError('Page not Found' , 404));
})


app.use((err , req , res , next) => {
  const {message = "Some Error Occured" , statusCode = 404} = err;
  res.render('pages/Error.ejs' , {message , statusCode});
})








app.listen(8000 , () => {
    console.log('Listening on port 8000 !!!');
})