import express from "express";
import { signUpUser } from "../controllers/authController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signUpUser);

export default router;
