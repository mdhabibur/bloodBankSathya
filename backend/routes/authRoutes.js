import express from "express";
import { signUpUser, verifyUserEmail, signInUser, logoutUser, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signUpUser);
router.post("/verify-email", verifyUserEmail);
router.post("/signin", signInUser)
router.post("/logout", logoutUser)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword )

export default router;
