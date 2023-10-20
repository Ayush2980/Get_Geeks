const userSchema = require('../models/users.js');
const User = new userSchema;
module.exports.getSignUp = (req , res) => {
    res.render('pages/Authentication_signup');
}
module.exports.signInRedirect = (req , res) => {
    req.flash('error' , "You need to be Signed In");
    res.redirect('/signin')
}
module.exports.postSignUp = async(req , res) => {
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
}
module.exports.getSignIn =  (req , res) => {
    res.render('pages/Authentication_signin');
}
module.exports.postSignIn = (req , res) => {
    req.flash('success' , 'Welcome Back');
    res.redirect(`/find`);
}
module.exports.signOut = (req , res) => {
    req.logout((err) => {
      if(err){return next(err)}
      req.flash('success' , 'GoodBye');
      res.redirect('/find');
  
    });
  }