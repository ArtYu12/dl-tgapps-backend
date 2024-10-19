const mongoose = require('mongoose');

const CourseModule = require('../models/CourseModule');

mongoose.connect("mongodb+srv://admin:admin@cluster0.lkraj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to the database');

    const couseId = "6713c3cdfc574a75ca2e3134"
    const modules = [
        {
            title: "Web development basics",
            description: "You will learn the basics of web development",
            content: `{"time":1697721600000,"blocks":[{"type":"header","data":{"text":"Module 1: Fundamentals of Web Development","level":1}},{"type":"paragraph","data":{"text":"Goal: Introduction to basic web development concepts and first steps in creating websites."}},{"type":"header","data":{"text":"1.1. Introduction to Web Technologies","level":2}},{"type":"list","data":{"style":"unordered","items":["What is the web?","How do websites work?","HTTP/HTTPS protocols","Browsers and web servers"]}},{"type":"header","data":{"text":"1.2. HTML: Structure of a Web Page","level":2}},{"type":"list","data":{"style":"unordered","items":["Introduction to HTML5","Basic tags and elements: text, headings, images, links, lists","Forms and user input","Semantic structure of HTML"]}},{"type":"header","data":{"text":"1.3. CSS: Styling Web Pages","level":2}},{"type":"list","data":{"style":"unordered","items":["Introduction to CSS3","Basic selectors and properties","Colors, fonts, and text","Page layout: block and inline models","Flexbox and Grid for modern layouts"]}},{"type":"header","data":{"text":"1.4. Tools for Web Development","level":2}},{"type":"list","data":{"style":"unordered","items":["Basics of working with text editors (VSCode, Sublime)","Using browser developer tools (Chrome DevTools)"]}}],"version":"2.27.0"}`,
            haveTest: true,
            haveHomework: false,
            courseId: couseId,
            videoLink: "https://pub-62dae59112e3408c8f75b95093c7ce14.r2.dev/2024-10-19%2001.12.23.mp4"
        },
        {
            title: "Interface and user experience (Frontend)",
            description: "You will learn about interface and user experience",
            content: `{"time":1697721600000,"blocks":[{"type":"header","data":{"text":"Module 2: Interface and User Experience (Frontend)","level":1}},{"type":"paragraph","data":{"text":"Goal: Learning the basics of user interaction and building dynamic, responsive interfaces."}},{"type":"header","data":{"text":"2.1. Introduction to JavaScript","level":2}},{"type":"list","data":{"style":"unordered","items":["JavaScript basics: variables, data types, operators","Basic data structures: arrays, objects","Conditional statements and loops"]}},{"type":"header","data":{"text":"2.2. Working with the DOM (Document Object Model)","level":2}},{"type":"list","data":{"style":"unordered","items":["Manipulating page elements with JavaScript","Adding, removing, and modifying DOM elements","Event handling: clicks, mouseover, data input"]}},{"type":"header","data":{"text":"2.3. Basics of Responsive Web Design","level":2}},{"type":"list","data":{"style":"unordered","items":["Using media queries to create responsive sites","Mobile-First design approach","Introduction to the Bootstrap framework for fast, responsive interfaces"]}},{"type":"header","data":{"text":"2.4. User Interaction","level":2}},{"type":"list","data":{"style":"unordered","items":["Forms and client-side validation","Handling user input and data processing"]}}],"version":"2.27.0"}`,
            haveTest: true,
            haveHomework: false,
            courseId: couseId,
            videoLink: "https://pub-62dae59112e3408c8f75b95093c7ce14.r2.dev/2024-10-19%2001.12.23.mp4"
        },
        {
            title: "Server development basics (Backend)",
            description: "You will learn the basics of server development",
            content: `{"time":1697721600000,"blocks":[{"type":"header","data":{"text":"Module 3: Fundamentals of Server-Side Development (Backend)","level":1}},{"type":"paragraph","data":{"text":"Goal: Understanding how the server-side of web applications works and basic interaction with databases."}},{"type":"header","data":{"text":"3.1. Introduction to Server-Side Development","level":2}},{"type":"list","data":{"style":"unordered","items":["Client-server architecture","Basics of working with a server and routing","Introduction to Node.js as a server-side tool"]}},{"type":"header","data":{"text":"3.2. Basics of Working with APIs","level":2}},{"type":"list","data":{"style":"unordered","items":["What is an API? Introduction to REST APIs","How servers and clients exchange data (JSON format)","Asynchronous JavaScript: \`fetch()\`, \`async/await\`"]}},{"type":"header","data":{"text":"3.3. Introduction to Databases","level":2}},{"type":"list","data":{"style":"unordered","items":["Introduction to relational databases: SQL, MySQL","Basic SQL queries: SELECT, INSERT, UPDATE, DELETE","Connecting a database to a Node.js server"]}}],"version":"2.27.0"}`,
            haveTest: true,
            haveHomework: false,
            courseId: couseId
        },
        {
            title: "Advanced web development and deployment",
            description: "You will learn advanced web development and deployment",
            content: `{"time":1697721600000,"blocks":[{"type":"header","data":{"text":"Module 4: Advanced Web Development and Deployment","level":1}},{"type":"paragraph","data":{"text":"Goal: Learning advanced web development concepts and preparing for real-world project deployment."}},{"type":"header","data":{"text":"4.1. Working with Frontend Frameworks","level":2}},{"type":"list","data":{"style":"unordered","items":["Introduction to popular frontend frameworks: React, Vue, or Angular","Understanding components and state management","Building reusable UI components"]}},{"type":"header","data":{"text":"4.2. Web Application Security","level":2}},{"type":"list","data":{"style":"unordered","items":["Understanding common web vulnerabilities: XSS, CSRF, SQL Injection","Best practices for secure coding","Using HTTPS and secure headers"]}},{"type":"header","data":{"text":"4.3. DevOps and Deployment","level":2}},{"type":"list","data":{"style":"unordered","items":["Introduction to containerization tools: Docker","Deploying web applications on hosting platforms: Heroku, Vercel, DigitalOcean","Version control with Git and GitHub"]}},{"type":"header","data":{"text":"4.4. Optimization and Scalability","level":2}},{"type":"list","data":{"style":"unordered","items":["Performance optimization techniques (image compression, code minification)","Lazy loading for improved performance","Client-side and server-side caching basics"]}}],"version":"2.27.0"}`,
            haveTest: true,
            haveHomework: false,
            courseId: couseId
        },
    ];

    const newC = await CourseModule.insertMany(modules)

    console.log(newC)
});

