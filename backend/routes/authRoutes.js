import express from "express";
import { signUpUser, verifyUserEmail, signInUser, logoutUser } from "../controllers/authController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signUpUser);
router.post("/verify-email", verifyUserEmail);
router.post("/signin", signInUser)
router.post("/logout", logoutUser)

export default router;
