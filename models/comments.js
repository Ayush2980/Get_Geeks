const { number, string } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types


const commentSchema = new mongoose.Schema({
    blogId : {
        type : ObjectId,
        ref : 'Blog'
    },
    content : {
        type : String,
    },
    author : {
        type : ObjectId,
        ref : 'User'
    }
});

module.exports = mongoose.model("Comment" , commentSchema);