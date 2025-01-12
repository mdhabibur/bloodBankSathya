import express from "express";
import { signUpUser, verifyUserEmail } from "../controllers/authController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signUpUser);
router.post("/verify-email", verifyUserEmail);

export default router;
