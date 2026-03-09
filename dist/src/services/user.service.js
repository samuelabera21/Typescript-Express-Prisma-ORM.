"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByAdmin = exports.updateUserProfile = exports.deleteUserProfile = exports.getUserProfile = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUserProfile = async (userId) => {
    const user = await prisma_1.default.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            created_at: true
        }
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getUserProfile = getUserProfile;
const deleteUserProfile = async (userId) => {
    await prisma_1.default.users.delete({
        where: {
            id: userId
        }
    });
    return {
        message: "User deleted successfully"
    };
};
exports.deleteUserProfile = deleteUserProfile;
const updateUserProfile = async (userId, name, email) => {
    if (!name && !email) {
        throw new Error("No fields provided for update");
    }
    if (email) {
        const existingUser = await prisma_1.default.users.findUnique({
            where: { email }
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error("Email already in use");
        }
    }
    const user = await prisma_1.default.users.update({
        where: { id: userId },
        data: {
            name,
            email
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            created_at: true
        }
    });
    return user;
};
exports.updateUserProfile = updateUserProfile;
const deleteUserByAdmin = async (userId) => {
    const user = await prisma_1.default.users.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new Error("User not found");
    }
    await prisma_1.default.users.delete({
        where: { id: userId }
    });
    return {
        message: "User deleted successfully"
    };
};
exports.deleteUserByAdmin = deleteUserByAdmin;
