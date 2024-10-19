const mongoose = require('mongoose');

const Course = require('../models/Course');
const CourseHomework = require('../models/CourseHomework');

mongoose.connect("mongodb+srv://admin:admin@cluster0.lkraj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to the database');

    const courses = [
        {
            moduleId: "6713c3cdfc574a75ca2e3134",
            content: "Build a simple app using React (or any framework of your choice) that includes at least two reusable components (e.g., a to-do list and a button)."
        },
    ];

    const newC = await CourseHomework.insertMany(courses)

    console.log(newC)
});

