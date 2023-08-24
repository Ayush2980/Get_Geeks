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




//Controller imports
const fetcher = require('./controllers/codechef');
const helper = require('./controllers/codeforces');
const { name } = require('ejs');
const { log } = require('console');


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
  console.log(req.user)
  console.log(req.isAuthenticated());
  next();
})


//Mongoose
main().catch(e => console.log(e)).then(() => console.log("Database connected !!!"));
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/getGeeks');
}

const User = new userSchema;




//Routes
app.get('/find' , (req , res) => {
  res.render('pages/homepage')
})


app.get('/signup' , (req , res) => {
  res.render('pages/Authentication_signup');
})

app.post('/register' ,  validateUser ,asyncError(async(req , res) => {
  try{
    const {password} = req.body;
    const user = new userSchema(req.body);
    // const result = await user.save();
    const registeredUser = await userSchema.register(user , password);
    req.login(registeredUser , (err) => {
      if(err) return next(err);
      req.flash('success' , 'Registered Successfully');
      res.redirect('/find')
    })
  }
  catch(e){
    req.flash('error' , e.message);
    res.redirect('/signup')
  }
}))

app.get('/signin' , (req , res) => {
  res.render('pages/Authentication_signin');
})

app.post('/signin' , passport.authenticate('local' , {failureFlash : true , failureRedirect : '/signin'}) , (req , res) => {
  req.flash('success' , 'Welcome Back');
  res.redirect('/find');
})

app.get('/signout' , (req , res) => {
  req.logout((err) => {
    if(err){return next(err)}
    req.flash('success' , 'GoodBye');
    res.redirect('/find');

  });
} )


app.get('/fetch' , asyncError(async(req , res) => {
    if(req.query.handle === "CF"){
      const userData = await helper.searchCF(req.query.search);
      if(userData == undefined) throw new HandleError("User Not Found",404);
      res.render('pages/findCF' , {userData});
    }
    else if(req.query.handle === "CC"){
      const userData = await fetcher.searchCode(req.query.search);
      if(userData == undefined) throw new HandleError("User Not Found",404);
      res.render('pages/findCC' , {userData});
    }
}));


//Error Handlers
app.all('*' , (req , res , next) => {
  next(new HandleError('Page not Found' , 404));
})


app.use((err , req , res , next) => {
  const {message = "hello motherfucker" , statusCode = 404} = err;
  res.status(statusCode).send(message);
})









app.listen(8000 , () => {
    console.log('Listening on port 8000 !!!');
})