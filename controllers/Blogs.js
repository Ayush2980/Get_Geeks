const blogSchema = require("../models/Blogs.js");
const userSchema = require("../models/users.js");
const commentSchema = require("../models/comments.js");
const { convertDate } = require("../public/JavaScript/Blog/blogs.js");

module.exports = {
  Blogs: async (req, res) => {
    const blogs = await blogSchema.find().populate("author");
    console.log(blogs);

    blogs.forEach((e) => {
      e.time = convertDate(e.createdAt);
      console.log(e.time);
    });
    res.render("pages/Blogs/Blogs.ejs", { blogs });
  },

  formBlogs: (req, res) => {
    res.render("pages/Blogs/BlogsForm.ejs");
  },

  postBlogs: async (req, res) => {
    try {
      req.body.author = req.user._id;
      const blog = await blogSchema(req.body);
      await blog.save();
      const user = await userSchema.findByIdAndUpdate(
        { _id: req.user._id },
        { $push: { blogs: blog._id } }
      );
      req.flash("success", "Uploaded Successfully !!");
      res.redirect("/Blogs");
    } catch (e) {
      const { message } = e;
      console.log(message);
      req.flash("error", message);
      res.redirect("/find");
    }
    // const { id } = req.params;
    // const data = req.body;
    // data.author = id;
    // const blog = new blogSchema(data);
    // try{
    //   await blog.save();
    //   const user = await userSchema.findByIdAndUpdate({_id : id} , {$push : {blogs : blog._id}});
    //   req.flash('success' , 'Uploaded Successfully !!');
    //   res.redirect('/Blogs');
    // }
    // catch(e){
    //   req.flash('error' , e.message);
    //   res.redirect('/newPost');
    // }
  },

  deleteBlogs: async (req, res, next) => {
    try {
      // const { blogId } = req.params;
      const blogId = req.user._id;
      const blogData = await blogSchema
        .findById({ _id: blogId })
        .populate("author");

      console.log(req.user);
      console.log("Blog iD : ", blogData.author._id);
      if (
        !req.user._id ||
        !(parseInt(blogData.author._id) == parseInt(req.user._id))
      ) {
        console.log(":unauthorized");
        return new Error("Unauthorised access !!");
      }
      const deleteBlog = await blogSchema.findByIdAndDelete({ _id: blogId });
      const updateAuthor = await userSchema.findByIdAndUpdate(
        { _id: blogData.author._id },
        { $pull: { blogs: blogId } }
      );
      return res.send({ success: true, msg: "Blog Deleted", blogId });
    } catch (e) {
      next(e);
    }
  },
  likeBtn: async (req, res) => {
    try {
      //Validating that the user has not liked earlier ==> this is to avoid anyone using postman to make multiple requests , other than this in client side , like button willbe disabled
      const { id, blogId } = req.params;
      console.log("From Params : ", blogId, id);
      const blogCheck = await blogSchema.findById(blogId);
      const hasLiked = blogCheck.likers.indexOf(id) > -1;
      if (!hasLiked) {
        //liking code
        const blog = await blogSchema.findOneAndUpdate(
          { _id: blogId },
          { $inc: { likes: 1 }, $push: { likers: id } },
          { returnOriginal: false }
        );
        res.send({ success: true, msg: "Liked Successfully", Blog: blog });
      } else {
        //disliking code
        const blog = await blogSchema.findOneAndUpdate(
          { _id: blogId },
          { $inc: { likes: -1 }, $pull: { likers: id } },
          { returnOriginal: false }
        );
        res.send({ success: true, msg: "Disliked Successfully", Blog: blog });
      }
    } catch (e) {
      res.send({ success: false, msg: e.message });
    }
  },
};
