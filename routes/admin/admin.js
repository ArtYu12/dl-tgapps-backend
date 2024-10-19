const express = require("express");
const router = express.Router();

const jwt = require("./../../utils/jwt")

const AdminUser = require("../../models/AdminUser")
const User = require("../../models/User")
const Course = require("../../models/Course")



router.get("/", async (req, res) => {
    try {
        if (req.cookies.token) {
            return res.redirect("/admin/dashboard")
        }

        res.render("pages/auth")
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
})

router.post("/auth", async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) return res.redirect("/admin")

        if (req.cookies.token) {
            return res.redirect("/admin/dashboard")
        }

        const user = await AdminUser.findOne({
            username,
            password
        })

        if (!user) {
            return res.redirect("/admin")
        }

        const token = jwt.generateToken({
            username,
            password
        })

        res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        res.redirect("/admin/dashboard")
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
})

// dashboard

router.get("/dashboard", async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.redirect("/admin")
        }
        const totalUsers = await User.countDocuments()
        const joinedToday = await User.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        })
        const totalCourses = await Course.countDocuments()
        res.render("pages/dashboard", {
            totalUsers,
            joinedToday,
            totalCourses
        })
    } catch (error) {
        console.error(error)
        res.render("pages/dashboard", {
            totalUsers: 0,
            joinedToday: 0,
            totalGiveaways: 0
        })
    }
})

router.get("/dashboard/courses", async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.redirect("/admin")
        }
        const courses = await Course.find()
        res.render("pages/courses", {
            courses
        })
    } catch (error) {
        console.error(error)
        res.render("pages/courses", {
            courses: []
        })
    }
})

router.get("/dashboard/course/:id", async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.redirect("/admin")
        }

        const courseId = req.params.id
        const course = await Course.findById(courseId)

        res.render("pages/course", {
            course
        })
    } catch (error) {
        console.error(error)
        res.render("pages/courses", {
            courses: []
        })
    }
})

router.post("/dashboard/course/new", async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.redirect("/admin")
        }
        const {author, title, description, image, price, currency, bonus, minimumSkill, category} = req.body;

        if(author || title || description || image || price || currency || bonus || minimumSkill || category){
            return res.status.json({
                success: false,
                data: {
                    error: "Not all"
                }
            })
        }

        const newCourse = new Course({
            author: author,
            title: title,
            description: description,
            image: image,
            price: price,
            currency: currency,
            bonus: bonus,
            minimumSkill: minimumSkill,
            category: category,
        })

        await newCourse.save();

        res.redirect("/dashboard/courses")

    } catch (error) {
        console.error(error)
        res.render("pages/courses", {
            course: []
        })
    }
})


module.exports = router;