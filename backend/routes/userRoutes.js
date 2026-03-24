import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
} from "../controller/userController.js";
import authUser from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

const router = express.Router();

/* Authenticated user routes */
router.get("/profile", authUser, getUserProfile);
router.put("/profile", authUser, updateUserProfile);

/* Admin routes */
router.get("/", authUser, authorizeRoles(ROLES.ADMIN), getAllUsers);
router.get("/:id", authUser, authorizeRoles(ROLES.ADMIN), getUserById);
router.put("/:id", authUser, authorizeRoles(ROLES.ADMIN), updateUserByAdmin);
router.delete("/:id", authUser, authorizeRoles(ROLES.ADMIN), deleteUser);

export default router;