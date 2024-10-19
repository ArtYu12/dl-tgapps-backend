const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
    author: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    currency: {
        type: String,
        enum: ["USD", "DL"]
    },
    bonus: {
        type: Number
    },
    minimumSkill: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseCategory"
    },
});

module.exports = mongoose.model("Course", CourseSchema);

