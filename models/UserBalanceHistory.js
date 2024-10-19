const mongoose = require('mongoose');

const UserBalanceHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ["in", "out"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    data: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("UserBalanceHistory", UserBalanceHistorySchema);