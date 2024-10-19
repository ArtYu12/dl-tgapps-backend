const mongoose = require("mongoose")

const CourseCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('CourseCategory', CourseCategorySchema);