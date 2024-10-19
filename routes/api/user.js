const express = require('express');
const router = express.Router();

const qs = require('querystring');

const User = require('../../models/User');
const UserBalanceHistory = require('../../models/UserBalanceHistory');
const UserCourse = require('../../models/UserCourse');
const UserCourseModule = require('../../models/UserCourseModule');
const Course = require('../../models/Course');
const CourseModule = require('../../models/CourseModule');
const WithdrawRequest = require('../../models/WithdrawRequest');

const {fetchImageAndConvertToBase64} = require("../../utils/fetchImageAndConvertToBase64");
const {sendDl} = require("../../helpers/sendDL");

router.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            success: false,
            data: {
                error: "Unauthorized"
            }
        });
    }

    try {
        const authB64 = req.headers.authorization;
        const auth = Buffer.from(authB64, "base64").toString("utf-8");
        const tgData = qs.parse(auth);

        req.tgData = tgData;

        if (!tgData.user) {
            return res.status(401).json({
                success: false,
                data: {
                    error: "Unauthorized"
                }
            });
        }

    } catch (error) {
        return res.status(401).json({
            success: false,
            data: {
                error: "Unauthorized"
            }
        });
    }
    next()
})

router.get("/me", async (req, res) => {
    try {
        const user = JSON.parse(req.tgData.user);
        const userData = await User.findOne({uid: user.id})

        if (!userData) {
            let base64Url = null;
            let tgUser = null;
            try {
                tgUser = await req.bot.telegram.getChat(user.id);
                const photo = await req.bot.telegram.getUserProfilePhotos(user.id);
                const file = await req.bot.telegram.getFile(photo["photos"][0][0].file_id);
                const photoUrl = `https://api.telegram.org/file/bot${req.bot.token}/${file.file_path}`;
                base64Url = await fetchImageAndConvertToBase64(photoUrl)
            } catch (error) {
                console.log(error);
                base64Url = ""
            }
            const newUser = new User({
                uid: user.id,
                username: tgUser.username,
                name: `${tgUser.first_name ? tgUser.first_name : ""}${tgUser.last_name ? ` ${tgUser.last_name}` : ""}`,
                photoBase64: base64Url,
                points: 0,
                createdAt: new Date()
            })

            await newUser.save();

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        uid: newUser.uid,
                        username: newUser.username,
                        name: newUser.name,
                        photoBase64: newUser.photoBase64,
                        points: newUser.points,
                        newUser: true
                    }
                }
            });
            return;
        }

        const courses = await UserCourse.find({userId: userData._id})

        for (let i = 0; i < courses.length; i++) {
            const modules = await UserCourseModule.find({courseId: courses[i].courseId, userId: userData._id}).lean()
            const course = await Course.findOne({_id: courses[i].courseId}).lean()
            const courseModules = await CourseModule.find({courseId: course._id}).lean()

            // progress
            const totalModules = courseModules.length
            const completedModules = modules.filter(m => m.status === "finished").length
            const progress = (completedModules / totalModules) * 100

            courses[i].progress = progress

            courses[i].title = course.title
            courses[i].image = course.image
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: userData.uid,
                    username: userData.username,
                    name: userData.name,
                    photoBase64: userData.photoBase64,
                    points: userData.points,
                    newUser: false
                },
                courses: courses.map(cItem => ({
                    id: cItem.courseId,
                    title: cItem.title,
                    image: cItem.image,
                    courseId: cItem.courseId,
                    status: cItem.status,
                    progress: cItem.progress
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {
                error: "Internal server error"
            }
        })
    }
})
router.get("/balance/history", async (req, res) => {
    try {
        const user = JSON.parse(req.tgData.user);
        const userData = await User.findOne({uid: user.id}).lean()

        if (!userData) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "User not found"
                }
            })
        }

        const history = await UserBalanceHistory.find({userId: userData._id}).lean()

        res.status(200).json({
            success: true,
            data: {
                history: history.map(hItem => ({
                    id: hItem._id,
                    title: hItem.title,
                    type: hItem.type,
                    amount: hItem.amount,
                    date: hItem.createdAt
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {
                error: "Internal server error"
            }
        })
    }
})

router.get("/courses", async (req, res) => {
    try {
        const user = JSON.parse(req.tgData.user);
        const userData = await User.findOne({uid: user.id})

        if (!userData) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "User not found"
                }
            })
        }

        const courses = await UserCourse.find({userId: userData._id})

        for (let i = 0; i < courses.length; i++) {
            const course = await Course.findOne({_id: courses[i].courseId}).lean()
            const courseModules = await CourseModule.find({courseId: course._id}).lean()


            // progress
            const totalModules = courseModules.length
            let completedModules = 0

            for (let j = 0; j < courseModules.length; j++) {
                const module = await UserCourseModule.find({userCourseId: courses[i]._id, moduleId: courseModules[j]._id}).lean()
                if (module.length > 0) {
                    if (module && module[0].finished) {
                        completedModules += 1
                    }
                }
            }

            console.log(completedModules, totalModules)

            const progress = (completedModules / totalModules) * 100

            courses[i].progress = progress

            courses[i].title = course.title
            courses[i].image = course.image
        }

        res.status(200).json({
            success: true,
            data: {
                courses: courses.map(cItem => ({
                    id: cItem._id,
                    title: cItem.title,
                    image: cItem.image,
                    courseId: cItem.courseId,
                    status: cItem.status,
                    progress: cItem.progress
                }))
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            data: {
                error: "Internal server error"
            }
        })
    }
})

router.post("/withdraw", async (req, res) => {
    try{
        const user = JSON.parse(req.tgData.user);
        const userData = await User.findOne({uid: user.id})

        if (!userData) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "User not found"
                }
            })
        }

        const {address} = req.body;

        if (!address) {
            return res.status(400).json({
                success: false,
                data: {
                    error: "Address is required"
                }
            })
        }

        if(userData.points === 0){
            return res.status(400).json({
                success: false,
                data: {
                    error: "You don't have enough points"
                }
            })
        }

        const newWithdrawRequest = new WithdrawRequest({
            userId: userData._id,
            amount: userData.points,
            address: address,
            status: "rejected",
            createdAt: new Date()
        })

        const newBalanceHistory = new UserBalanceHistory({
            userId: userData._id,
            type: "out",
            amount: userData.points,
            title: "Withdraw all",
            description: "",
            data:{
                address: address
            },
            createdAt: new Date()
        })

        await newWithdrawRequest.save();
        await newBalanceHistory.save();

        userData.points = 0;
        await userData.save();

        sendDl(address, userData.points * Math.pow(10, 6))

        res.status(200).json({
            success: true,
            data: {
                message: "Withdraw request created"
            }
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            data: {
                error: "Internal server error"
            }
        })
    }
})

module.exports = router;