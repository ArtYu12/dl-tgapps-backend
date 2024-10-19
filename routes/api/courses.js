const express = require("express");
const qs = require("querystring");
const TonWeb = require("tonweb");
const {Address} = require('tonweb');

const User = require("../../models/User");
const CourseCategory = require("../../models/CourseCategory");
const Course = require("../../models/Course");
const UserCourse = require("../../models/UserCourse");
const UserCourseModule = require("../../models/UserCourseModule");
const CourseModule = require("../../models/CourseModule")
const UserBalanceHistory = require("../../models/UserBalanceHistory")
const CourseTest = require("../../models/CourseTest")
const UserSBT = require("../../models/UserSBT")
const CourseHomework = require("../../models/CourseHomework")
const UserCourseModuleTestResult = require("../../models/UserCourseModuleTestResult")
const UserCourseModuleHomework = require("../../models/UserCourseModuleHomework")

const router = express.Router();

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
        const auth = Buffer.from(authB64, 'base64').toString('utf-8');
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
    next();
})

router.get("/", async (req, res) => {
    try {
        const coursesCategory = await CourseCategory.find();
        const courses = await Course.find();

        res.status(200).json({
            success: true,
            data: {
                coursesCategory: coursesCategory.map((category) => {
                    return {
                        id: category._id,
                        title: category.title,
                        position: category.position,
                    }
                }),
                courses: courses.map((course) => {
                    return {
                        id: course._id,
                        title: course.title,
                        description: course.description,
                        image: course.image,
                        price: course.price,
                        category: course.category,
                        minimumSkill: course.minimumSkill,
                    }
                })
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
});

router.get("/category/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryDetails = await CourseCategory.findById(categoryId).lean();
        console.log(categoryDetails)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Category not found"
                }
            });
        }

        const courses = await Course.find({category: categoryId}).lean();

        res.status(200).json({
            success: true,
            data: {
                categoryName: categoryDetails.title,
                courses: courses.map((course) => {
                    return {
                        id: course._id,
                        title: course.title,
                        description: course.description,
                        image: course.image,
                        price: course.price,
                        category: categoryDetails.title,
                    }
                })
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        console.log(courseId)
        const course = await Course.findById(courseId).lean();

        if (!course) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not found"
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                course: {
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    image: course.image,
                    price: course.price,
                    category: course.category,
                    bonus: course.bonus,
                    minimumSkill: course.minimumSkill
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.get("/:id/my", async (req, res) => {
    try {
        const courseId = req.params.id;
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

        const course = await UserCourse.findOne({courseId, userId: userData._id}).lean()
        const modules = await UserCourseModule.find({userCourseId: course._id}).lean()

        res.status(200).json({
            success: true,
            data: {
                course: {
                    status: course.status,
                },
                modules: modules.map((module) => {
                    return {
                        id: module._id,
                        finished: module.finished,
                        currentStep: module.currentStep,
                    }
                }),
                lastModule: modules[modules.length - 1]
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.post("/:id/start", async (req, res) => {
    try {
        const courseId = req.params.id;
        console.log(courseId)
        const user = JSON.parse(req.tgData.user);
        console.log(user)
        const userData = await User.findOne({uid: user.id})

        if (!userData) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "User not found"
                }
            })
        }

        const course = await UserCourse.findOne({courseId, userId: userData._id})
        console.log(course)

        if (course) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course already started"
                }
            })
        }

        const newCourse = new UserCourse({
            courseId,
            userId: userData._id,
            status: "pending"
        })
        await newCourse.save()

        res.status(200).json({
            success: true,
            data: {
                message: "Course started"
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.get("/:id/modules/", async (req, res) => {
    try {
        const courseId = req.params.id;
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

        const modules = await CourseModule.find({courseId}).lean()

        res.status(200).json({
            success: true,
            data: {
                modules: modules.map((module) => {
                    return {
                        id: module._id,
                        title: module.title,
                        description: module.description
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.get("/:id/modules/:moduleId", async (req, res) => {
    try {
        const courseId = req.params.id;
        const moduleId = req.params.moduleId;
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

        const module = await CourseModule.findOne({courseId, _id: moduleId}).lean()

        if (!module) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not found"
                }
            })
        }
        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        const userModule = await UserCourseModule.findOne({userCourseId: userCourse._id, moduleId}).lean()

        if (!userModule) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not started"
                }
            })
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    currentStep: userModule.currentStep,
                    finished: userModule.finished
                },
                module: {
                    id: module._id,
                    title: module.title,
                    description: module.description,
                    content: module.content,
                    video: module.videoLink,
                    haveTest: module.haveTest,
                    haveHomework: module.haveHomework
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.post("/:id/modules/:moduleId/start", async (req, res) => {
    try {
        const courseId = req.params.id;
        const moduleId = req.params.moduleId;
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

        const module = await CourseModule.findOne({courseId, _id: moduleId}).lean()

        if (!module) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        const userModule = await UserCourseModule.findOne({courseId, moduleId, userId: userData._id})

        if (userModule) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module already started"
                }
            })
        }

        const newModule = new UserCourseModule({
            userCourseId: userCourse._id,
            currentStep: "theory",
            moduleId
        })
        await newModule.save()

        res.status(200).json({
            success: true,
            data: {
                message: "Module started"
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.post("/:id/modules/:moduleId/next", async (req, res) => {
    try {
        const courseId = req.params.id;
        const moduleId = req.params.moduleId;
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

        const module = await CourseModule.findOne({courseId, _id: moduleId}).lean()

        if (!module) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        const userModule = await UserCourseModule.findOne({userCourseId: userCourse._id, moduleId})

        if (!userModule) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not started"
                }
            })
        }

        const course = await Course.findById(courseId).lean()

        if (userModule.currentStep == "theory") {
            if (module.haveTest) {
                userModule.currentStep = "test"
            } else if (module.haveHomework) {
                userModule.currentStep = "homework"
            } else {
                userModule.finished = true
            }
        } else if (userModule.currentStep == "test") {
            if (module.haveHomework) {
                userModule.currentStep = "homework"
            } else {
                userModule.finished = true
            }
        } else if (userModule.currentStep == "homework") {
            userModule.finished = true
        }
        await userModule.save()

        if (userModule.finished) {
            const modules = await UserCourseModule.find({userCourseId: userCourse._id}).lean()
            const finishedModulesLength = modules.filter((module) => module.finished).length
            const totalCourseModules = await CourseModule.find({courseId}).countDocuments()

            if (finishedModulesLength == totalCourseModules) {
                userCourse.status = "finished"
                await userCourse.save()

                userData.points += course.bonus
                await userData.save()

                const newHistory = new UserBalanceHistory({
                    userId: userData._id,
                    title: "Course completed",
                    data: [
                        {title: "Course", value: course.title},
                        {title: "Bonus", value: course.bonus}
                    ],
                    type: "in",
                    amount: course.bonus
                })
                await newHistory.save()
            }
        }

        res.status(200).json({
            success: true,
            data: {
                message: "Next step",
                isModuleFinished: userModule.finished,
                isCourseFinished: userCourse.status == "finished",
                nextStep: userModule.currentStep
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.get("/:id/modules/:moduleId/test", async (req, res) => {
    try {
        const courseId = req.params.id;
        const moduleId = req.params.moduleId;
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

        const module = await CourseModule.findOne({courseId, _id: moduleId}).lean()

        if (!module) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        const userModule = await UserCourseModule.findOne({userCourseId: userCourse._id, moduleId})

        if (!userModule) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not started"
                }
            })
        }

        if (userModule.currentStep != "test") {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not in test step"
                }
            })
        }

        const test = await CourseTest.find({moduleId}).lean()

        if (!test) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Test not found"
                }
            })
        }

        res.json({
            success: true,
            data: {
                test: test.map((test) => {
                    return {
                        id: test._id,
                        question: test.question,
                        answers: test.answers.map((answer) => {
                            return {
                                id: answer._id,
                                answer: answer.answer
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.post("/:id/modules/:moduleId/test", async (req, res) => {
    try {
        const courseId = req.params.id;
        const moduleId = req.params.moduleId;
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

        const module = await CourseModule.findOne({courseId, _id: moduleId}).lean()

        if (!module) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        const userModule = await UserCourseModule.findOne({userCourseId: userCourse._id, moduleId})

        if (!userModule) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not started"
                }
            })
        }

        if (userModule.currentStep != "test") {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not in test step"
                }
            })
        }

        const test = await CourseTest.find({moduleId}).lean()

        if (!test) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Test not found"
                }
            })
        }

        const correctAnswers = test.filter((test) => {
            return test.answers.filter((answer) => answer.isCorrect).length
        }).length

        const userAnswers = req.body.answers
        // [{ question: "id", answer: "id" }]

        if (userAnswers.length != test.length) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Invalid answers count"
                }
            })
        }

        let correctAnswersCount = 0

        for (let i = 0; i < userAnswers.length; i++) {
            const testQuestion = test.find((test) => test._id == userAnswers[i].question)
            if (!testQuestion) {
                return res.status(404).json({
                    success: false,
                    data: {
                        error: "Invalid question"
                    }
                })
            }
            const testAnswer = testQuestion.answers.find((answer) => answer._id == userAnswers[i].answer)
            if (!testAnswer) {
                return res.status(404).json({
                    success: false,
                    data: {
                        error: "Invalid answer"
                    }
                })
            }
            if (testAnswer.isCorrect) {
                correctAnswersCount += 1
            }
        }

        const result = (correctAnswersCount / correctAnswers) * 100

        if (result >= 50) {
            const userTestResult = new UserCourseModuleTestResult({
                userCourseModuleId: userModule._id,
                maxPoints: correctAnswers,
                points: correctAnswersCount,
                answers: userAnswers
            })
            await userTestResult.save()

            if (userModule.currentStep == "test") {
                if (module.haveHomework) {
                    userModule.currentStep = "homework"
                } else {
                    userModule.finished = true
                }
            }
        }
        await userModule.save()

        if (userModule.finished) {
            const modules = await UserCourseModule.find({userCourseId: userCourse._id}).lean()
            const finishedModulesLength = modules.filter((module) => module.finished).length
            const totalCourseModules = await CourseModule.find({courseId}).countDocuments()

            if (finishedModulesLength == totalCourseModules) {
                userCourse.status = "finished"
                await userCourse.save()

                userData.points += course.bonus
                await userData.save()

                const newHistory = new UserBalanceHistory({
                    userId: userData._id,
                    title: "Course completed",
                    data: [
                        {title: "Course", value: course.title},
                        {title: "Bonus", value: course.bonus}
                    ],
                    type: "in",
                    amount: course.bonus
                })
                await newHistory.save()
            }
        }

        res.json({
            success: true,
            data: {
                result,
                passed: result >= 50,
                correctAnswers: correctAnswersCount,
                totalAnswers: correctAnswers,

                isModuleFinished: userModule.finished,
                isCourseFinished: userCourse.status == "finished"
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.get("/:id/modules/:moduleId/homework", async (req, res) => {
    try {
        const courseId = req.params.id;
        const moduleId = req.params.moduleId;
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

        const module = await CourseModule.findOne({courseId, _id: moduleId}).lean()

        if (!module) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        const userModule = await UserCourseModule.findOne({userCourseId: userCourse._id, moduleId})

        if (!userModule) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not started"
                }
            })
        }

        if (userModule.currentStep != "homework") {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not in homework step"
                }
            })
        }

        const homework = await CourseHomework.findOne({moduleId}).lean()

        if (!homework) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Homework not found"
                }
            })
        }

        res.json({
            success: true,
            data: {
                homework: {
                    id: homework._id,
                    content: homework.content
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.post("/:id/modules/:moduleId/homework", async (req, res) => {
    try {
        const courseId = req.params.id;
        const moduleId = req.params.moduleId;
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

        const module = await CourseModule.findOne({courseId, _id: moduleId}).lean()

        if (!module) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        const userModule = await UserCourseModule.findOne({userCourseId: userCourse._id, moduleId})

        if (!userModule) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not started"
                }
            })
        }

        if (userModule.currentStep != "homework") {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Module not in homework step"
                }
            })
        }

        const homework = await CourseHomework.findOne({moduleId}).lean()

        if (!homework) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Homework not found"
                }
            })
        }

        const userHomework = await UserCourseModuleHomework.findOne({userCourseModuleId: userModule._id})

        if (userHomework) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Homework already sent"
                }
            })
        }

        const newHomework = new UserCourseModuleHomework({
            userCourseModuleId: userModule._id,
            text: req.body.content
        })
        await newHomework.save()

        userModule.finished = true
        await userModule.save()

        const modules = await UserCourseModule.find({userCourseId: userCourse._id }).lean()
        const finishedModulesLength = modules.filter((module) => module.finished).length
        const totalCourseModules = await CourseModule.find({courseId}).countDocuments()

        if (finishedModulesLength == totalCourseModules) {
            userCourse.status = "finished"
            await userCourse.save()

            userData.points += module.bonus
            await userData.save()

            const newHistory = new UserBalanceHistory({
                userId: userData._id,
                title: "Course completed",
                data: [
                    {title: "Course", value: module.title},
                    {title: "Bonus", value: module.bonus}
                ],
                type: "in",
                amount: module.bonus
            })
            await newHistory.save()
        }

        res.json({
            success: true,
            data: {
                message: "Homework sent",
                isModuleFinished: userModule.finished,
                isCourseFinished: userCourse.status == "finished"
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.get("/:id/claim", async (req, res) => {
    try {
        const courseId = req.params.id;
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

        const course = await Course.findById(courseId).lean()

        if (!course) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        if (userCourse.status != "finished") {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not finished"
                }
            })
        }

        res.json({
            success: true,
            data: {
                claimed: userCourse.claimed
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

router.post("/:id/claim", async (req, res) => {
    try {
        const courseId = req.params.id;
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

        const course = await Course.findById(courseId).lean()

        if (!course) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not found"
                }
            })
        }

        const userCourse = await UserCourse.findOne({
            courseId,
            userId: userData._id
        })

        if (!userCourse) {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not started"
                }
            })
        }

        if (userCourse.status != "finished") {
            return res.status(404).json({
                success: false,
                data: {
                    error: "Course not finished"
                }
            })
        }

        const {wallet} = req.body

        const sbt = new UserSBT({
            courseId,
            userId: userData._id,
            status: "pending",
            walletAddress: wallet
        })
        await sbt.save()

        userCourse.claimed = true
        await userCourse.save()

        res.json({
            success: true,
            data: {
                message: "Claim request sent"
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: "Internal server error",
            },
        });
    }
})

module.exports = router;