import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from "../controller/productController.js";
import authUser from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { ROLES } from "../utils/roles.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/farmer/me", authUser, authorizeRoles(ROLES.FARMER), getMyProducts);
router.post("/", authUser, authorizeRoles(ROLES.FARMER, ROLES.ADMIN), createProduct);
router.put("/:id", authUser, authorizeRoles(ROLES.FARMER, ROLES.ADMIN), updateProduct);
router.delete("/:id", authUser, authorizeRoles(ROLES.FARMER, ROLES.ADMIN), deleteProduct);

export default router;
