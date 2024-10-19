const mongoose = require('mongoose');

const UserCourseSchema = new mongoose.Schema({
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
        enum: ["pending", "finished"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    claimed: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model("UserCourse", UserCourseSchema);