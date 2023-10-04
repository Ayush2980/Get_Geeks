const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const chats = new mongoose.Schema({
    isGroupChat : {
        type : Boolean,
    },
    members : [{
        memberId : {
            type : ObjectId,
            ref : 'User'
        }
    }],
    groupAdmin : [{
        memberId : {
            type : ObjectId,
            ref : 'User'
        }
    }],
    chats : [{
        senderId : ObjectId,
        timeStamp : Date,
        reaction : String
    }]
})

module.exports = mongoose.model('Chat' , chats);