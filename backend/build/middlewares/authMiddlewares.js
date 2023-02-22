"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthentication = exports.userAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const appError_js_1 = __importDefault(require("../utils/appError.js"));
const HttpStatus_js_1 = require("../types/HttpStatus.js");
exports.userAuthentication = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        const tokenSecret = process.env.JWT_SECRET;
        jsonwebtoken_1.default.verify(token, tokenSecret, async (err, payload) => {
            try {
                if (err) {
                    throw new appError_js_1.default("UnAuthorized User", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
                }
                req.userId = payload.userId;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    else {
        throw new appError_js_1.default("token not found", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
});
exports.adminAuthentication = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        const tokenSecret = process.env.JWT_SECRET;
        jsonwebtoken_1.default.verify(token, tokenSecret, async (err, payload) => {
            try {
                if (err) {
                    throw new appError_js_1.default("UnAuthorized Admin", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
                }
                return next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    else {
        throw new appError_js_1.default("token not found", HttpStatus_js_1.HttpStatus.UNAUTHORIZED);
    }
});
