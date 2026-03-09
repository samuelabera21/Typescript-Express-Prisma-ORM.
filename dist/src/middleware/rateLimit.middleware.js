"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationLimiter = exports.logoutLimiter = exports.refreshLimiter = exports.loginLimiter = exports.registerLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const baseRateLimitOptions = {
    standardHeaders: true,
    legacyHeaders: false,
};
exports.registerLimiter = (0, express_rate_limit_1.default)({
    ...baseRateLimitOptions,
    windowMs: 15 * 60 * 1000,
    max: 8,
    message: { message: "Too many register attempts. Try again in 15 minutes." },
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    ...baseRateLimitOptions,
    windowMs: 15 * 60 * 1000,
    max: 12,
    message: { message: "Too many login attempts. Try again in 15 minutes." },
});
exports.refreshLimiter = (0, express_rate_limit_1.default)({
    ...baseRateLimitOptions,
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: { message: "Too many refresh requests. Slow down and retry shortly." },
});
exports.logoutLimiter = (0, express_rate_limit_1.default)({
    ...baseRateLimitOptions,
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: { message: "Too many logout requests. Slow down and retry shortly." },
});
exports.resendVerificationLimiter = (0, express_rate_limit_1.default)({
    ...baseRateLimitOptions,
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Too many verification email requests. Try again later." },
});
