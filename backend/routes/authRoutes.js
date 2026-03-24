import express from "express";
import {
  checkAuth,
  loginUser,
  logout,
  registerUser,
} from "../controller/authController.js";
import authUser from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

const router = express.Router();

/* PUBLIC ROUTES */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* AUTH ROUTES */
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);

/* ROLE ROUTES */
router.get(
  "/admin",
  authUser,
  authorizeRoles(ROLES.ADMIN),
  (req, res) => {
    res.json({ success: true, message: "Welcome Admin" });
  }
);

router.get(
  "/farmer",
  authUser,
  authorizeRoles(ROLES.FARMER),
  (req, res) => {
    res.json({ success: true, message: "Welcome Farmer" });
  }
);

router.get(
  "/shop",
  authUser,
  authorizeRoles(ROLES.BUYER, ROLES.ADMIN),
  (req, res) => {
    res.json({ success: true, message: "Welcome to Shop" });
  }
);

export default router;