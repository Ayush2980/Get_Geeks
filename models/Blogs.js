const { number } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const blogSchema = new mongoose.Schema({
    author : {
        type : ObjectId,
        ref : 'User'
    },
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    likers : [{
        type : ObjectId,
        ref : 'User'
    }],
    likes : {
        type : Number,
        default : 0
    },
    comments : [{
        commentId : {
            type : ObjectId ,
            ref : 'Comment'
        }
    }]
} ,     { timestamps: true, });


module.exports = mongoose.model("Blog" , blogSchema);