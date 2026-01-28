import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized — Token missing" });
    }
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — Invalid token",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized — User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in Auth middleware :", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized — Invalid or expired token",
    });
  }
};
