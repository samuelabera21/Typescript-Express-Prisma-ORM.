// import { Router } from "express";

// const router = Router();

// router.post("/register");
// router.post("/login");

// export default router;

import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;