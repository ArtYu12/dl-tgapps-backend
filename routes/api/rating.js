const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const qs = require("querystring");

// raiting by points

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
        const users = await User.find().sort({points: -1}).limit(10);
        res.json({
            success: true,
            data: users.map(u => {
                return {
                    id: u._id,
                    name: u.name,
                    username: u.username,
                    photoBase64: u.photoBase64,
                    points: u.points
                }
            })
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: {
                error: error.message
            }
        });
    }
});

// get user place by points

router.get("/me", async (req, res) => {
    try {
        const user = JSON.parse(req.tgData.user);
        const userData = await User.findOne({uid: user.id})

        const users = await User.find().sort({points: -1});
        const place = users.findIndex(u => u.uid === userData.uid) + 1;

        res.json({
            success: true,
            data: {
                place
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            data: {
                error: error.message
            }
        });
    }
})

module.exports = router;