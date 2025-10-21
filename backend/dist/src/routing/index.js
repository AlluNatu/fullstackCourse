"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const validateToken_1 = require("../middleware/validateToken");
const Courses_1 = require("../models/Courses");
dotenv_1.default.config();
const router = (0, express_1.Router)();
router.post("/api/register", async (req, res) => {
    console.log("SHIT CALLED :)");
    console.log(req.body);
    try {
        let email = req.body.email;
        let foundUser = await User_1.users.findOne({ email: email });
        console.log(foundUser);
        if (foundUser) {
            res.status(403).json({ email: "Email already in use" });
        }
        else {
            const salt = bcrypt_1.default.genSaltSync(10);
            const hash = bcrypt_1.default.hashSync(req.body.password, salt);
            let newUser = new User_1.users({
                email: req.body.email,
                password: hash,
                imageId: null
            });
            await newUser.save();
            res.status(200).json(newUser);
            console.log(newUser);
        }
    }
    catch (error) {
        console.error(`Error during registeration: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/api/login", //logValidator,
async (req, res) => {
    try {
        let email = req.body.email;
        const foundUser = await User_1.users.findOne({ email: email });
        if (foundUser) {
            if (bcrypt_1.default.compareSync(req.body.password, foundUser.password)) {
                const JwtPayload = {
                    _id: foundUser._id,
                };
                const token = jsonwebtoken_1.default.sign(JwtPayload, process.env.SECRET, { expiresIn: "30m" });
                res.status(200).json({ success: true, token });
            }
            else {
                res.status(401).json({ message: "Login failed" });
            }
        }
        else {
            res.status(401).json({ message: "Login failed" });
        }
    }
    catch (error) {
        console.error(`Error during registeration: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post('/api/addLike', validateToken_1.validateToken, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            console.log("User not found or token invalid");
            res.status(401).json({ message: 'Access denied.' });
        }
        const foundUser = await User_1.users.findOne({ _id: user._id });
        if (!foundUser) {
            res.status(404).json({ message: 'User not found.' });
        }
        console.log("Request body:", req.body);
        const updatedCourse = await Courses_1.courses.updateOne({ _id: req.body.id }, { $inc: { likes: 1 } });
        if (updatedCourse.modifiedCount === 0) {
            res.status(404).json({ message: 'Course not found or not updated.' });
        }
        res.status(200).json({ message: "Like added successfully." });
    }
    catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/api/addDisLike', validateToken_1.validateToken, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            console.log("User not found or token invalid");
            res.status(401).json({ message: 'Access denied.' });
        }
        const foundUser = await User_1.users.findOne({ _id: user._id });
        if (!foundUser) {
            res.status(404).json({ message: 'User not found.' });
        }
        console.log("Request body:", req.body);
        const updatedCourse = await Courses_1.courses.updateOne({ _id: req.body.id }, { $inc: { Dislikes: 1 } });
        if (updatedCourse.modifiedCount === 0) {
            res.status(404).json({ message: 'Course not found or not updated.' });
        }
        res.status(200).json({ message: "Dislike added successfully." });
    }
    catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get("/api/getCourses", validateToken_1.validateToken, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        let courseList = await Courses_1.courses.find();
        res.json({ courseList });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error" });
    }
});
exports.default = router;
