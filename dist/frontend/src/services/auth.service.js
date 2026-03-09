"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.logoutUser = logoutUser;
exports.getCurrentUser = getCurrentUser;
exports.verifyEmail = verifyEmail;
exports.resendVerificationEmail = resendVerificationEmail;
const api_1 = require("./api");
async function loginUser(data) {
    return (0, api_1.apiFetch)("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
async function registerUser(data) {
    return (0, api_1.apiFetch)("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
async function logoutUser() {
    return (0, api_1.apiFetch)("/auth/logout", {
        method: "POST",
    });
}
async function getCurrentUser() {
    return (0, api_1.apiFetch)("/user/profile");
}
async function verifyEmail(data) {
    return (0, api_1.apiFetch)("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
async function resendVerificationEmail(email) {
    return (0, api_1.apiFetch)("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}
