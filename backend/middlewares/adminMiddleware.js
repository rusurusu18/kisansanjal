import { ROLES } from "../utils/roles.js";

export const protect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  next();
};

export const admin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};