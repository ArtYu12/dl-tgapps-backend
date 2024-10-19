const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    name: {
        type: String
    },
    photoBase64: {
        type: String
    },
    points: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("User", UserSchema);