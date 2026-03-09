"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateProfile = exports.deleteProfile = exports.getProfile = void 0;
const user_service_1 = require("../services/user.service");
const user_service_2 = require("../services/user.service");
const user_service_3 = require("../services/user.service");
const user_service_4 = require("../services/user.service");
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await (0, user_service_1.getUserProfile)(userId);
        res.json({
            message: "User profile fetched",
            user
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
exports.getProfile = getProfile;
const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await (0, user_service_2.deleteUserProfile)(userId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.deleteProfile = deleteProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email } = req.body;
        const user = await (0, user_service_3.updateUserProfile)(userId, name, email);
        res.json({
            message: "Profile updated successfully",
            user
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
exports.updateProfile = updateProfile;
const deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const result = await (0, user_service_4.deleteUserByAdmin)(userId);
        res.json(result);
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
exports.deleteUser = deleteUser;
