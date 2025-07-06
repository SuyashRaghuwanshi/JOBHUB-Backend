const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        trim: true
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    readBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

module.exports = mongoose.model('Message', MessageSchema);