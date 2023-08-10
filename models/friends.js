const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    password : {
        type : String ,
        required : true
    },
    email : String , 
})

module.exports = mongoose.model('User' , friendsSchema);