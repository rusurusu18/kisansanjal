
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          message: "Unauthorized",
          success: false,
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden: Access denied",
          success: false,
        });
      }

      next();
    } catch (error) {
      console.error("Error in authorizeRoles:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};