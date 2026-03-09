"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationEmail = exports.verifyEmail = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_service_2 = require("../services/auth.service");
const auth_service_3 = require("../services/auth.service");
const auth_service_4 = require("../services/auth.service");
const auth_service_5 = require("../services/auth.service");
const email_service_1 = require("../services/email.service");
const showDebugVerificationLinks = process.env.DEBUG_EMAIL_LINKS === "true";
const isProduction = process.env.NODE_ENV === "production";
const baseCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
};
const accessCookieOptions = {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
};
const refreshCookieOptions = {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await (0, auth_service_1.registerUser)(email, password, name);
        await (0, email_service_1.sendVerificationEmail)(email, result.verificationUrl);
        const responseBody = {
            message: "Registration successful. Verification email sent.",
            user: result.user,
        };
        if (showDebugVerificationLinks) {
            responseBody.verificationUrl = result.verificationUrl;
            responseBody.verificationToken = result.verificationToken;
        }
        return res.status(201).json({
            ...responseBody,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed";
        return res.status(400).json({
            message,
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_2.loginUser)(email, password);
        res.cookie("accessToken", result.accessToken, accessCookieOptions);
        res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
        return res.json({
            message: "Login successful",
            user: result.user
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        return res.status(401).json({
            message
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const tokenFromCookie = req.cookies?.refreshToken;
        if (!tokenFromCookie) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }
        const token = await (0, auth_service_3.refreshAccessToken)(tokenFromCookie);
        res.cookie("accessToken", token.accessToken, accessCookieOptions);
        return res.json({
            message: "Token refreshed"
        });
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid refresh token"
        });
    }
};
exports.refreshToken = refreshToken;
const logout = async (_req, res) => {
    res.clearCookie("accessToken", baseCookieOptions);
    res.clearCookie("refreshToken", baseCookieOptions);
    return res.json({
        message: "Logout successful"
    });
};
exports.logout = logout;
const verifyEmail = async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) {
            return res.status(400).json({
                message: "Email and token are required",
            });
        }
        const result = await (0, auth_service_5.verifyEmailToken)(email, token);
        return res.json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Email verification failed";
        return res.status(400).json({
            message,
        });
    }
};
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }
        const result = await (0, auth_service_4.resendVerification)(email);
        await (0, email_service_1.sendVerificationEmail)(email, result.verificationUrl);
        const responseBody = {
            message: "Verification email sent",
        };
        if (showDebugVerificationLinks) {
            responseBody.verificationUrl = result.verificationUrl;
            responseBody.verificationToken = result.verificationToken;
        }
        return res.json(responseBody);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unable to resend verification email";
        return res.status(400).json({
            message,
        });
    }
};
exports.resendVerificationEmail = resendVerificationEmail;
