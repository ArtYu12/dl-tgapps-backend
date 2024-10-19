const mongoose = require("mongoose")

const CourseHomeworkSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    content: {
        type: String,
    }
})

module.exports = mongoose.model("CourseHomework", CourseHomeworkSchema)//