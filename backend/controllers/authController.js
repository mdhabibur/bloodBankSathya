import bcrypt from "bcryptjs";
import User from "../models/User.js";
import crypto from "crypto";
import { sendUserVerificationEmail } from "../mailtrap/sendMails.js";

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
			data: {
				user: {
					id: newUser._id,
					username: newUser.username,
					email: newUser.email,
					userType: newUser.userType,
				},
			},
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
		});
	} catch (error) {
		console.error("Error in verifyUserEmail:", error);
		res.status(500).json({ success: false, message: "Server error  in verifying user email" });
	}
};
