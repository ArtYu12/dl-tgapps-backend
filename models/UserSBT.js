const mongoose = require('mongoose');

const UserSBTSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ["pending", "minted"],
        default: "pending"
    },
    walletAddress: {
        type: String,
    },
})

module.exports = mongoose.model("UserSBT", UserSBTSchema);