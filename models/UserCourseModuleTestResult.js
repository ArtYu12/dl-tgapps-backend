const mongoose = require('mongoose');

const UserCourseModuleTestResult = new mongoose.Schema({
    userCourseModuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCourseModule',
    },
    maxPoints: {
        type: Number,
    },
    points: {
        type: Number,
    },
    answers: {
        type: Object
    },
})

module.exports = mongoose.model("UserCourseModuleTestResult", UserCourseModuleTestResult);