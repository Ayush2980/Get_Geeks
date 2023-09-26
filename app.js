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





//Controller imports
const fetcher = require('./controllers/codechef');
const helper = require('./controllers/codeforces');
const { name } = require('ejs');
const { log } = require('console');
const { all } = require('axios');


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

const User = new userSchema;




//Routes


app.get('/find' , (req , res) => {
  res.render('pages/homepage')
})


app.get('/signup' , (req , res) => {
  res.render('pages/Authentication_signup');
})
app.post('/register'  , upload.single('image') ,asyncError(async(req , res) => {
  console.log(JSON.parse(JSON.stringify(req.body.user)) , req.file);
  try{
    const {password} = req.body.user;
    const user = new userSchema(req.body.user);
    user.images = {
      url : req.file.path , 
      filename : req.file.filename
    }
    // const result = await user.save();
    const registeredUser = await userSchema.register(user , password);
    req.login(registeredUser , (err) => {
      if(err) return next(err);
      req.flash('success' , 'Registered Successfully');
      res.redirect(`/find`);
    })
  }
  catch(e){
    req.flash('error' , e.message);
    res.redirect(`/signup`)
  }
}));

app.get('/signin' , (req , res) => {
  res.render('pages/Authentication_signin');
})

app.post('/signin'  , passport.authenticate('local' , {failureFlash : true , failureRedirect : '/signin'}) , (req , res) => {
  req.flash('success' , 'Welcome Back');
  res.redirect(`/find`);
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
      res.locals.image_stalk = userData.userImage;
      res.render('pages/findCF' , {userData});
    }
    else if(req.query.handle === "CC"){
      const userDataCC = await fetcher.searchCode(req.query.search);
      if(userDataCC == undefined) throw new HandleError("User Not Found",404);
      res.render('pages/findCC' , {userDataCC});
    }
}));

  
  //Authenticated Users
  app.post('/profile/:id' , asyncError(async(req , res) => {
    const currUser = await userSchema.findById(req.params.id).populate('followers').populate('following');
    console.log(currUser);
    // const userDataCC = await fetcher.searchCode(currUser.CCprof);
    // const userData = await helper.searchCF(currUser.CFprof);
    // res.render('pages/profile.ejs' , {currUser , userData , userDataCC});
    res.send(currUser);
    
  }))

  app.post('/addFriend/:id/:friendId' , asyncError(async(req , res) => {
    const currUser = await userSchema.findByIdAndUpdate({_id : req.params.id} , {$push : {following : req.params.friendId}});
    const friend = await userSchema.findByIdAndUpdate({_id : req.params.friendId} , {$push : {followers : req.params.id}});
    req.flash('success' , 'Followed');console.log("Done")

    res.redirect('/find');
    // res.redirect(`/profile/${req.params.friendId}`);
  }))

app.get('/users/:id' , asyncError(async(req ,res) => {
  const allUsers = await userSchema.find();
  for(var i =0; i < allUsers.length ;i++){
    if(allUsers[i].id == req.params.id) allUsers.splice(i , 1);
  }
  const currUser = await userSchema.findById(req.params.id).populate({path : 'friendList' , populate : {path : 'friendId'}}).populate('pending');
  console.log(currUser.pending);
  res.render('pages/Alluser.ejs' , {allUsers,currUser});
}));

app.post('/Cfstalk/:id/:username' , asyncError(async(req ,res) => {
  const friend = {
    username : req.params.username,
    handle : "CF"
  }
  const id = req.params.id;
  const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$push : {Stalklist : friend}}).then(() => console.log("Done Updating "))
  req.flash('success' , 'Successfully added to Stalklist')
  res.redirect(`/stalklist/${req.params.id}`);
}))


app.post('/Ccstalk/:id/:username' , asyncError(async(req ,res) => {
  const friend = {
    username : req.params.username,
    handle : "CC"
  }
  const id = req.params.id;
  const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$push : {Stalklist : friend}}).then(() => console.log("Done Updating "))
  req.flash('success' , 'Successfully added to Stalklist');
  res.redirect(`/stalklist/${req.params.id}`);
}))

app.get('/delete/:id/:username' , asyncError(async(req , res) => {
  console.log("Heer i am");
  const currUser = await userSchema.findByIdAndUpdate({_id : req.params.id} , {$pull : {Stalklist : {username : req.params.username}}});
  req.flash('success' , 'Successfully removed from Stalklist')
  res.redirect(`/stalklist/${req.params.id}`);
  
}))



app.get('/stalklist/:id' , asyncError(async(req , res) => {
  const {Stalklist} = await userSchema.findById(req.params.id);
  console.log(Stalklist)
  res.render('pages/stalklist.ejs' , {Stalklist});
}))


//Friend addition and removal routes
app.post('/sendReq/:id/:friendID' , asyncError(async(req, res) => {
  const {id , friendID} = req.params;
  const friend = await userSchema.findByIdAndUpdate({_id : friendID} , {$push : {pending : id}});
  const friendReq = {
    friendId : friendID,
    status : -1
  }
  const user = await userSchema.findByIdAndUpdate({_id : id} , {$push : {friendList : friendReq}});
  req.flash('success' , `Frined Request sent to ${friend.username}`);
  res.redirect('/find');
}))


app.post('/accept/:id/:friendId' , asyncError(async(req  , res) => {
  const {id , friendId} = req.params;
  const friend = {
    friendId : friendId,
    status : 1
  }
  const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$pull : {pending : friendId} , $push : {friendList : friend}});
  // console.log(currUser.pending)
  // Sorted till here ---------
  const friendData = await userSchema.findByIdAndUpdate({_id : friendId} , {$set : {friendList : {friendId : id , status : 1}} })
  req.flash('success' , 'Request Accepted');
  res.redirect('/find');
}))

app.post('/reject/:id/:friendId' , asyncError(async(req , res) => {
  const {id , friendId} = req.params;
  const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$pull : {pending : friendId}});
  const friendData = await userSchema.findByIdAndUpdate({_id : friendId} , {$pull : {friendList : {friendId : id}}})
  req.flash('error' , 'Request Rejected');
  res.redirect('/find');
}))

app.post('/removeFriend/:id/:friendID' , asyncError(async(req , res) => {
  const {id , friendID} = req.params;
  const currUser = await userSchema.findByIdAndUpdate({_id : id} , {$pull : {friendList : {friendId : friendID}}});
  const friendData = await userSchema.findByIdAndUpdate({_id : friendID} , {$pull : {friendList : {friendId : id}}})
  req.flash('error' , 'Friend Removed');
  res.redirect('/find');

}))



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