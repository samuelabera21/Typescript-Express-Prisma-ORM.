import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { refreshToken } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


router.post("/refresh", refreshToken);

export default router;