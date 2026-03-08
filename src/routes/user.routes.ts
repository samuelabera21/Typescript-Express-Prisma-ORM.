import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getProfile } from "../controllers/user.controller";
import { deleteProfile } from "../controllers/user.controller";
import { updateProfile } from "../controllers/user.controller";
import { requireRole } from "../middleware/role.middleware";
import { deleteUser } from "../controllers/user.controller";




const router = express.Router();
router.get("/profile", authMiddleware, getProfile);
router.delete("/profile", authMiddleware, deleteProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteUser
);

export default router;