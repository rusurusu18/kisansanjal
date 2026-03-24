import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controller/orderController.js";
import authUser from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

const router = express.Router();

router.post("/", authUser, authorizeRoles(ROLES.BUYER), createOrder);
router.get("/mine", authUser, authorizeRoles(ROLES.BUYER), getMyOrders);
router.get("/:id", authUser, getOrderById);
router.put("/:id/status", authUser, authorizeRoles(ROLES.ADMIN), updateOrderStatus);
router.put("/:id/cancel", authUser, cancelOrder);

export default router;
