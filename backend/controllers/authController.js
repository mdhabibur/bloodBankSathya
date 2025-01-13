import bcrypt from "bcryptjs";
import User from "../models/User.js";
import crypto from "crypto";
import { sendUserVerificationEmail } from "../mailtrap/sendMails.js";
import jwt from "jsonwebtoken";
import { generateJWTandSetCookie } from "../utils/generateJWTandSetCookie.js";

// User sign-up controller
export const signUpUser = async (req, res) => {
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
			return res
				.status(400)
				.json({ success: false, message: "Email already exists" });
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
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const verifyUserEmail = async (req, res) => {
	const { code } = req.body;

	try {
		const user = await User.findOne({
			verificationCode: code,
			verificationCodeExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired verification code",
			});
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
		res.status(500).json({
			success: false,
			message: "Server error  in verifying user email",
		});
	}
};

export const signInUser = async (req, res) => {
	const { email, password, userType } = req.body;

	try {
		// Validate input
		if (!email || !password || !userType) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		// Check if user exists
		const user = await User.findOne({ email, userType });

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Email Or User type does not match" });
		}

		// Compare passwords
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid password" });
		}

		//remove password field in response
		user.password = undefined;

		// Generate JWT token
		await generateJWTandSetCookie(user, res);

		res.status(200).json({
			success: true,
			message: "Sign in successful",
			data: { user },
		});
	} catch (error) {
		console.error("Error in signInUser:", error);
		res
			.status(500)
			.json({ success: false, message: "Server error signInUser" });
	}
};

export const logoutUser = async (req, res) => {
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
		res.status(500).json({
			success: false,
			message: "Server error during logout",
		});
	}
};
