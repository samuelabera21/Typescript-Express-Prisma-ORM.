import { Router } from "express";
import {
	register,
	login,
	logout,
	resendVerificationEmail,
	verifyEmail,
} from "../controllers/auth.controller";
import { refreshToken } from "../controllers/auth.controller";
import {
	loginLimiter,
	logoutLimiter,
	refreshLimiter,
	registerLimiter,
	resendVerificationLimiter,
} from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", logoutLimiter, logout);
router.post("/verify-email", verifyEmail);
router.post(
	"/resend-verification",
	resendVerificationLimiter,
	resendVerificationEmail
);


router.post("/refresh", refreshLimiter, refreshToken);

export default router;