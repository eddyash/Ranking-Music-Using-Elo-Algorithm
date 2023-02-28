const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type:String,
    },
    author: {
        type:String,
    },
    streams: {
        type:Number,
    },
    rating: {
        type:Number,
        default: 1000
    }

});

module.exports = mongoose.model('Music', userSchema);