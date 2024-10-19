const mongoose = require("mongoose")

const CourseModuleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    title: {
        type: String
    },
    description: {
        type: String,
    },
    content: {
        type: String,
    },
    videoLink: {
        type: String,
    },
    haveTest: {
        type: Boolean,
    },
    haveHomework: {
        type: Boolean,
    }
})

module.exports = mongoose.model("CourseModule", CourseModuleSchema)//