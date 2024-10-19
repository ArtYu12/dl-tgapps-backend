const mongoose = require('mongoose');

const CourseModule = require('../models/CourseModule');
const CourseTest = require('../models/CourseTest');

mongoose.connect("mongodb+srv://admin:admin@cluster0.lkraj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to the database');

    const moduleId = "6713c3cdfc574a75ca2e3134"
    const questions = [
        {
            question: "What is HTML?",
            answers: [
                {
                    answer: "Hyper Text Markup Language",
                    isCorrect: true
                },
                {
                    answer: "Hyperlinks and Text Markup Language",
                    isCorrect: false
                },
                {
                    answer: "Home Tool Markup Language",
                    isCorrect: false
                },
                {
                    answer: "None of the above",
                    isCorrect: false
                },
            ],
            moduleId
        },
        {
            question: "What is CSS?",
            answers: [
                {
                    answer: "Cascading Style Sheet",
                    isCorrect: true
                },
                {
                    answer: "Computer Style Sheet",
                    isCorrect: false
                },
                {
                    answer: "Colorful Style Sheet",
                    isCorrect: false
                },
                {
                    answer: "None of the above",
                    isCorrect: false
                },
            ],
            moduleId
        },
        {
            question: "What is JavaScript?",
            answers: [
                {
                    answer: "JavaScript is a scripting language",
                    isCorrect: true
                },
                {
                    answer: "JavaScript is a programming language",
                    isCorrect: false
                },
                {
                    answer: "JavaScript is a styling language",
                    isCorrect: false
                },
                {
                    answer: "None of the above",
                    isCorrect: false
                },
            ],
            moduleId
        },
    ];

    const newC = await CourseTest.insertMany(questions)

    console.log(newC)
});

