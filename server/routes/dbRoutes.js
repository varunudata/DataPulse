import express, { Router } from "express";
import { connectControler } from "../controllers/connectionController.js";

const router = express.Router();

router.post("/connect", connectControler);
export default router;
