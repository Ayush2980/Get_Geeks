const blogSchema = require('../models/Blogs.js');
const userSchema = require('../models/users.js');
const commentSchema = require('../models/comments.js');

module.exports.Blogs = async(req, res) => {
  const blogs = await blogSchema.find().populate('author');
  res.render("pages/Blogs.ejs" , {blogs});
};

module.exports.formBlogs = (req, res) => {
  res.render("pages/BlogsForm.ejs");
};

module.exports.postBlogs = async(req, res) => {
  const { id } = req.params;
  const data = req.body;
  data.author = id;
  const blog = new blogSchema(data);
  try{
    await blog.save();
    const user = await userSchema.findByIdAndUpdate({_id : id} , {$push : {blogs : blog._id}});
    req.flash('success' , 'Uploaded Successfully !!');
    res.redirect('/Blogs');
  }
  catch(e){
    req.flash('error' , e.message);
    res.redirect('/newPost');
  }
};



module.exports.likeBtn = async(req, res) => {
  try{
    //Validating that the user has not liked earlier ==> this is to avoid anyone using postman to make multiple requests , other than this in client side , like button willbe disabled
    const {id , blogId} = req.params;
    const blogCheck = await blogSchema.findById(blogId);
    const isTrue = (blogCheck.likers.indexOf(id) > -1);
    if(!isTrue){
      const blog = await blogSchema.findOneAndUpdate({_id : blogId} , {$inc : {likes : 1} , $push : {likers:id}} , { returnOriginal: false });
      console.log(blog)
      res.send({success : true , msg : "Liked Successfully" ,Blog : blog });
    }
    else{
      res.send({success : false , msg : "Dont act smart!!!"});
    }
  }catch(e){
    res.send({success : false , msg : e.message});
  }
}

module.exports.unlikeBtn = async(req, res) => {
  try{
    const {id , blogId} = req.params;
    const blogCheck = await blogSchema.findById(blogId);
    const isTrue = (blogCheck.likers.indexOf(id) > -1);
    if(isTrue){//This means that this user has liked it earlier
      const blog = await blogSchema.findOneAndUpdate({_id : blogId} , {$inc : {likes : -1} , $pull: {likers:id}} ,  { returnOriginal: false });
      res.send({success : true , msg : "Disliked Successfully" , Blog : blog});
    }
    else{
      res.send({success : true , msg : "Dont act smart!!!"});
    }
  }catch(e){
    res.send({success : false , msg : e.message});
  }
}