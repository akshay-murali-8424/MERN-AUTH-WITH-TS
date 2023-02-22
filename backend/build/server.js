"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const admin_js_1 = __importDefault(require("./routes/admin.js"));
const appError_js_1 = __importDefault(require("./utils/appError.js"));
const db_js_1 = __importDefault(require("./db.js"));
dotenv_1.default.config({ path: "config.env" });
const server = (0, express_1.default)();
server.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use((0, cookie_parser_1.default)());
server.use('/api', user_js_1.default);
server.use('/api/admin', admin_js_1.default);
// Development logging
if (process.env.NODE_ENV == 'development') {
    server.use((0, morgan_1.default)('dev'));
}
//connecting mongodb
(0, db_js_1.default)();
// catch 404 and forward to error handler
server.all('*', (req, res, next) => {
    next(new appError_js_1.default('Not found', 404));
});
// error handler
server.use(function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (err.statusCode === 404) {
        res.status(err.statusCode).json({ errors: err.status, errorMessage: err.message });
    }
    else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
});
server.listen(process.env.PORT, () => {
    console.log(`Server listening on Port ${process.env.PORT}`);
});
