const { number } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    fullname : {
        type : String,
        required : true,
    },
    state : {
        type : String,
        required : true,
    },
    country : {
        type : String , 
        required : true
    },
    CCprof : {
        type : String
    },
    CFprof : {
        type : String
    },
    images : {
        url : String , 
        filename : String
    },
    Stalklist : [{
        type : Object
    }],
    friendList : [{
        friendId : {
            type : ObjectId,
            ref : "User",
        },
        status : {
            type : String,
        }
    }],
    pending : [{
        type : ObjectId,
        ref : "User",
    }],
    blogs : [{
        type : ObjectId,
        ref : 'Blog'
    }]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);