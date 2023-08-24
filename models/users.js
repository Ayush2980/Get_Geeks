const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
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
    Stalklist : [{
        type : String
    }],
    followers : [{
        type : ObjectId ,
        ref : "GGUsers"
    }],
    following : [{
        type : ObjectId ,
        ref : "GGUsers"
    }]    
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);