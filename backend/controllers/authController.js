import bcrypt from "bcryptjs";
import User from "../models/User.js";
import crypto from "crypto";
import {
	sendResetPasswordEmail,
	sendResetPasswordSuccessfulEmail,
	sendUserVerificationEmail,
} from "../mailtrap/sendMails.js";
import jwt from "jsonwebtoken";
import { generateJWTandSetCookie } from "../utils/generateJWTandSetCookie.js";
import CustomError from "../utils/CustomError.js";

// User sign-up controller
export const signUpUser = async (req, res, next) => {
	const {
		username,
		email,
		password,
		phone,
		userType,
		hospitalName,
		website,
		organizationName,
	} = req.body;

	try {
		// Check if the email is already in use
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new CustomError(400, false, "Email already exists");
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		//generate 6 digit verification code
		const verificationCode = crypto.randomInt(100000, 999999).toString();

		// Set expiration time to 1 hour from now
		const verificationCodeExpires = Date.now() + 60 * 60 * 1000; //1 hour

		// Create a new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			phone,
			userType,
			hospitalName: userType === "hospital" ? hospitalName : undefined,
			website:
				userType === "hospital" || userType === "organization"
					? website
					: undefined,
			organizationName:
				userType === "organization" ? organizationName : undefined,
			verificationCode,
			verificationCodeExpires,
		});

		await newUser.save();

		//send verification email
		await sendUserVerificationEmail(email, verificationCode);

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			// data: {
			// 	user: {...newUser._doc,password: undefined},
			// },
		});
	} catch (error) {
		console.error("Error in signUpUser:", error);
		next(error);
	}
};

export const verifyUserEmail = async (req, res, next) => {
	const { code } = req.body;

	try {
		const user = await User.findOne({
			verificationCode: code,
			verificationCodeExpires: { $gt: Date.now() },
		});

		if (!user) {
			throw new CustomError(
				401,
				false,
				"Invalid or expired verification code "
			);
		}

		user.isEmailVerified = true;
		user.verificationCode = undefined;
		user.verificationCodeExpires = undefined;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			// data: {user}
		});
	} catch (error) {
		console.error("Error in verifyUserEmail:", error);
		next(error);
	}
};

export const signInUser = async (req, res, next) => {
	const { email, password, userType } = req.body;

	try {
		// Validate input
		if (!email || !password || !userType) {
			throw new CustomError(400, false, "All fields are required");
		}

		// Check if user exists
		const user = await User.findOne({ email, userType });

		if (!user) {
			throw new CustomError(404, false, "Email or user type does not match");
		}

		// Compare passwords
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new CustomError(401, false, "Invalid password");
		}

		//remove password field in response
		user.password = undefined;

		// Generate JWT token
		await generateJWTandSetCookie(user, res);

		res.status(200).json({
			success: true,
			message: "Sign in successful",
			data: {
				user: {
					...user._doc,
					_id: undefined,
					verificationCode: undefined,
					verificationCodeExpires: undefined,
				},
			},
		});
	} catch (error) {
		console.error("Error in signInUser:", error);
		next(error);
	}
};

export const logoutUser = async (req, res, next) => {
	try {
		// Clear the JWT cookie
		res.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Use secure flag in production
			sameSite: "strict", // Prevent cross-site cookie sharing
		});

		res.status(200).json({
			success: true,
			message: "Logout successful",
		});
	} catch (error) {
		console.error("Error in logoutUser:", error);
		next(error);
	}
};

export const forgotPassword = async (req, res, next) => {
	const { email } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Generate a reset token
		const resetToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");

		// Set token and expiration in user document
		user.resetPasswordToken = hashedToken;
		user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // Token valid for 60 minutes
		await user.save();

		// Send email with reset link
		const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

		await sendResetPasswordEmail(user.email, resetUrl);

		res.status(200).json({
			success: true,
			message: "Reset link sent to your email",
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};


export const resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;
  
	try {
	  // Hash the provided token to match the one in the database
	  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
	  // Find the user by the hashed token and ensure the token is still valid
	  const user = await User.findOne({
		resetPasswordToken: hashedToken,
		resetPasswordExpires: { $gt: Date.now() },
		// Check token expiration
	  });
  
	  if (!user) {
		return res.status(400).json({
		  success: false,
		  message: "Invalid or expired password reset token",
		});
	  }
  
  
	  // Hash the new password
	  const salt = await bcrypt.genSalt(10);
	  const hashedPassword = await bcrypt.hash(password, salt);
  
	  // Update user's password and clear reset token fields
	  user.password = hashedPassword;
	  user.resetPasswordToken = undefined;
	  user.resetPasswordExpires = undefined;
	  await user.save();

	  await sendResetPasswordSuccessfulEmail(user.email);

	  res.status(200).json({
		success: true,
		message: "Password reset successful.Redirecting...",
	  });
	} catch (error) {
	  console.error("Error resetting password:", error);
	  res.status(500).json({
		success: false,
		message: "Failed to reset password. Please try again.",
	  });
	}
  }; 