const mongoose = require('mongoose');

const UserCourseModuleSchema = new mongoose.Schema({
    userCourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCourse',
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseModule',
    },
    currentStep: {
        type: String,
        default: "theory",
        enum: ["theory", "test", "homework"]
    },
    finished: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model("UserCourseModule", UserCourseModuleSchema);