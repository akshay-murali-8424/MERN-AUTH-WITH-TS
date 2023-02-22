"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = exports.addNewUser = exports.getAllUsers = exports.verifyLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_js_1 = __importDefault(require("../utils/appError.js"));
const adminModel_js_1 = __importDefault(require("../models/adminModel.js"));
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const HttpStatus_js_1 = require("../types/HttpStatus.js");
exports.verifyLogin = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel_js_1.default.findOne({ email });
    if (!admin) {
        throw new appError_js_1.default("invalid credentials", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    const isPasswordCorrect = await bcryptjs_1.default.compare(password, admin.password);
    if (!isPasswordCorrect) {
        throw new appError_js_1.default("invalid credentials", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    const token = jsonwebtoken_1.default.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });
    res.json({
        status: "success",
        message: "admin verified",
        token,
    });
});
exports.getAllUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const users = await userModel_js_1.default.find({});
    res.json({
        status: "success",
        users
    });
});
exports.addNewUser = (0, express_async_handler_1.default)(async (req, res) => {
    let { name, email, password } = req.body;
    email = email.toLowerCase();
    const isExistingEmail = await userModel_js_1.default.findOne({ email });
    if (isExistingEmail) {
        throw new appError_js_1.default("existing email", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    // hashing password
    password = await bcryptjs_1.default.hash(password, salt);
    await userModel_js_1.default.create({ name, email, password });
    res.json({
        status: "success",
        message: "new user added"
    });
});
exports.editUser = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.params.id;
    let { name, email } = req.body;
    email = email.toLowerCase();
    const isExistingEmail = await userModel_js_1.default.findOne({ email });
    const user = await userModel_js_1.default.findById(userId);
    if (isExistingEmail && user?.email != email) {
        throw new appError_js_1.default("existing email", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
    await userModel_js_1.default.findByIdAndUpdate(userId, { $set: { name, email } });
    res.json({
        status: "success",
        message: "user details modified"
    });
});
exports.deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.params.id;
    await userModel_js_1.default.findByIdAndDelete(userId);
    res.json({
        status: "success",
        message: "user deleted"
    });
});
