import express from "express";
import { signUpUser, verifyUserEmail, signInUser } from "../controllers/authController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signUpUser);
router.post("/verify-email", verifyUserEmail);
router.post("/signin", signInUser)

export default router;
