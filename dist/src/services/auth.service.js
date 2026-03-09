"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.resendVerification = exports.verifyEmailToken = exports.loginUser = exports.registerUser = void 0;
exports.buildVerificationUrl = buildVerificationUrl;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;
function createVerificationToken() {
    return crypto_1.default.randomBytes(32).toString("hex");
}
function createVerificationExpiry() {
    return new Date(Date.now() + VERIFICATION_EXPIRY_MS);
}
function buildVerificationUrl(token, email) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const encodedEmail = encodeURIComponent(email);
    return `${frontendUrl}/verify-email?token=${token}&email=${encodedEmail}`;
}
const registerUser = async (email, password, name) => {
    //here i need to check email is already exist or not
    const existingUser = await prisma_1.default.users.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    //if not exist then i need to hash the password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const verificationToken = createVerificationToken();
    const verificationExpires = createVerificationExpiry();
    //create user to database
    const user = await prisma_1.default.users.create({
        data: {
            email: email,
            password_hash: hashedPassword,
            name: name,
            email_verified: false,
            verification_token: verificationToken,
            verification_expires: verificationExpires,
        },
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            email_verified: user.email_verified,
        },
        verificationToken,
        verificationUrl: buildVerificationUrl(verificationToken, user.email),
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.default.users.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const passwordMatch = await bcrypt_1.default.compare(password, user.password_hash);
    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }
    if (!user.email_verified) {
        throw new Error("Please verify your email before logging in");
    }
    const accessToken = jsonwebtoken_1.default.sign({
        userId: user.id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({
        userId: user.id
    }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    };
};
exports.loginUser = loginUser;
const verifyEmailToken = async (email, token) => {
    const user = await prisma_1.default.users.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.email_verified) {
        return {
            message: "Email already verified",
        };
    }
    if (!user.verification_token || user.verification_token !== token) {
        throw new Error("Invalid verification link");
    }
    if (!user.verification_expires ||
        user.verification_expires.getTime() < Date.now()) {
        throw new Error("Verification link expired");
    }
    await prisma_1.default.users.update({
        where: { email },
        data: {
            email_verified: true,
            verification_token: null,
            verification_expires: null,
        },
    });
    return {
        message: "Email verified successfully",
    };
};
exports.verifyEmailToken = verifyEmailToken;
const resendVerification = async (email) => {
    const user = await prisma_1.default.users.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.email_verified) {
        throw new Error("Email is already verified");
    }
    const verificationToken = createVerificationToken();
    const verificationExpires = createVerificationExpiry();
    await prisma_1.default.users.update({
        where: { email },
        data: {
            verification_token: verificationToken,
            verification_expires: verificationExpires,
        },
    });
    return {
        message: "Verification email sent",
        verificationToken,
        verificationUrl: buildVerificationUrl(verificationToken, email),
    };
};
exports.resendVerification = resendVerification;
const refreshAccessToken = async (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jsonwebtoken_1.default.sign({
        userId: decoded.userId
    }, process.env.JWT_SECRET, { expiresIn: "15m" });
    return {
        accessToken: newAccessToken
    };
};
exports.refreshAccessToken = refreshAccessToken;
