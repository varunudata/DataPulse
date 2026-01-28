import prisma from "../config/prisma.js";

import { checkPassword, hashPassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        passwordHash: hashedPassword,
      },
    });
    if (!newUser) {
      return res
        .status(400)
        .json({ success: false, message: "Error in creating a new user" });
    }
    const token = generateToken(newUser.id);
    return res.status(201).json({
      success: true,
      message: "New user created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in sign up :", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error in sign up" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required",
      });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exists",
      });
    }
    const isMatch = await checkPassword(password, existingUser.passwordHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }
    const token = generateToken(existingUser.id);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in signin :", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error in sign in" });
  }
};
