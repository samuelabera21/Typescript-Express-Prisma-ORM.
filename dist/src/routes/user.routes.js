"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const user_controller_2 = require("../controllers/user.controller");
const user_controller_3 = require("../controllers/user.controller");
const role_middleware_1 = require("../middleware/role.middleware");
const user_controller_4 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/profile", auth_middleware_1.authMiddleware, user_controller_1.getProfile);
router.delete("/profile", auth_middleware_1.authMiddleware, user_controller_2.deleteProfile);
router.patch("/profile", auth_middleware_1.authMiddleware, user_controller_3.updateProfile);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)("admin"), user_controller_4.deleteUser);
exports.default = router;
