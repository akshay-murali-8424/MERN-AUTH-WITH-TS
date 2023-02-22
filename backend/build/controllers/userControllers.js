"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.setProfilePicture = exports.register = exports.verifyLogin = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_js_1 = __importDefault(require("../utils/appError.js"));
const cloudinary_js_1 = __importDefault(require("../utils/cloudinary.js"));
const HttpStatus_js_1 = require("../types/HttpStatus.js");
exports.verifyLogin = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel_js_1.default.findOne({ email });
    if (!user) {
        throw new appError_js_1.default("this user doesn't exist", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new appError_js_1.default("Sorry, your password was incorrect. Please double-check your password", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });
    res.json({
        status: "success",
        message: "verified user",
        data: {
            userId: user._id,
            name: user.name,
        },
        token
    });
});
exports.register = (0, express_async_handler_1.default)(async (req, res) => {
    let { name, email, password } = req.body;
    email = email.toLowerCase();
    const isExistingEmail = await userModel_js_1.default.findOne({ email });
    if (isExistingEmail) {
        throw new appError_js_1.default("existing email", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    // hashing password
    password = await bcryptjs_1.default.hash(password, salt);
    const user = await userModel_js_1.default.create({ name, email, password });
    const userId = user._id;
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });
    res.json({
        status: "success",
        data: {
            userId,
            name: user.name,
        },
        token
    });
});
exports.setProfilePicture = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.params.id;
    if (!req.file) {
        throw new appError_js_1.default("please upload your image before submit", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    const { url } = await cloudinary_js_1.default.uploader.upload(req.file.path);
    await userModel_js_1.default.findByIdAndUpdate(userId, { $set: { picture: url } });
    res.json({
        status: "success",
        message: "profile picture updated",
    });
});
exports.getUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req;
    const userData = await userModel_js_1.default.findById(userId);
    res.json({
        status: "success",
        userData
    });
});
