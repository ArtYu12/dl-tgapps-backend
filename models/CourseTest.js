const mongoose = require("mongoose")

const CourseTestAnswerSchema = new mongoose.Schema({
    answer: {
        type: String
    },
    isCorrect: {
        type: Boolean
    }
})

const CourseTestSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseModule',
    },
    question: {
        type: String
    },
    answers: {
        type: [CourseTestAnswerSchema]
    },
})

module.exports = mongoose.model("CourseTest", CourseTestSchema)