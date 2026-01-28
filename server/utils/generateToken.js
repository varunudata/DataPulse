import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ id: Number(userId) }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
