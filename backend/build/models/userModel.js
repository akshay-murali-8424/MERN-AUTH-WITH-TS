"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "please add a name"]
    },
    email: {
        type: String,
        required: [true, "please add a email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please add a password"]
    },
    picture: String
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("User", userSchema);
