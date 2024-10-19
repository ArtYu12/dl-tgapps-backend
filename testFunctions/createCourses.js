const mongoose = require('mongoose');

const Course = require('../models/Course');

mongoose.connect("mongodb+srv://admin:admin@cluster0.lkraj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to the database');

    const courses = [
        {
            title: "Web Development: from Zero to Hero with test",
            description: "Learn web development from scratch",
            image: "https://img-c.udemycdn.com/course/480x270/437398_46c3_10.jpg",
            author: "undefined team",
            price: 0,
            currency: "DL",
            minimumSkill: "beginner",
            category: "671288b480a517c61f731ec3",
            bonus: 500
        },
        {
            title: "React: the complete guide with test",
            description: "Learn React from scratch",
            image: "https://img-b.udemycdn.com/course/240x135/1565838_e54e_18.jpg",
            author: "undefined team",
            price: 0,
            currency: "DL",
            minimumSkill: "beginner",
            category: "671288b480a517c61f731ec3",
            bonus: 800
        },
        {
            title: "Getting started with SwiftUI with test",
            description: "Learn SwiftUI from scratch",
            image: "https://img-c.udemycdn.com/course/240x135/1778502_f4b9_12.jpg",
            author: "undefined team",
            price: 0,
            currency: "DL",
            minimumSkill: "beginner",
            category: "671288b480a517c61f731ec4",
            bonus: 1500
        },
    ];

    const newC = await Course.insertMany(courses)

    console.log(newC)
});

