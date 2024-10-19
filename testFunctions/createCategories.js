const mongoose = require('mongoose');
const Category = require('../models/CourseCategory');

mongoose.connect("mongodb+srv://admin:admin@cluster0.lkraj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to the database');

    const categories = [
        {
            title: "Web Development",
            position: 1
        },
        {
            title: "Mobile Development",
            position: 2
        },
        {
            title: "Data Science",
            position: 3
        },
        {
            title: "Machine Learning",
            position: 4
        },
        {
            title: "Artificial Intelligence",
            position: 5
        },
        {
            title: "Blockchain",
            position: 6
        },
        {
            title: "Cybersecurity",
            position: 7
        },
        {
            title: "Cloud Computing",
            position: 8
        },
        {
            title: "DevOps",
            position: 9
        },
        {
            title: "UI/UX Design",
            position: 10
        },
    ];

    const newC = await Category.insertMany(categories)

    console.log(newC)
});

