const express = require('express');
const router = express.Router();

const userRouter = require('./api/user');
const coursesRouter = require('./api/courses');
const ratingRouter = require('./api/rating');

router.use('/user', userRouter);
router.use('/courses', coursesRouter);
router.use('/rating', ratingRouter);

module.exports = router;