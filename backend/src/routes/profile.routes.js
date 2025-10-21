import { deleteProfile } from "../controllers/profile.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPublicProfile,
  getPrivateProfile,
  patchProfile,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/public", getPublicProfile);
router.delete("/private", authMiddleware, deleteProfile);
router.get("/private", authMiddleware, getPrivateProfile);
router.patch("/private", authMiddleware, patchProfile);
export default router;