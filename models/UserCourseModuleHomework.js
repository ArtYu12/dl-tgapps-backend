const mongoose = require('mongoose');

const UserCourseModuleHomework = new mongoose.Schema({
    userCourseModuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCourseModule',
    },
    text: {
        type: String,
    },
})

module.exports = mongoose.model("UserCourseModuleHomework", UserCourseModuleHomework);