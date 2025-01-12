import jwt from "jsonwebtoken";

export const generateJWTandSetCookie = async (user, res) => {
	try {
		// Generate JWT
		const token = jwt.sign(
			{ userId: user._id, userType: user.userType },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		// Set token in HTTP-only cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			sameSite: "strict", // Prevent CSRF
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});

		return token;
	} catch (error) {
		console.error("Error generating JWT and setting cookie:", error);
		throw new Error("Failed to generate authentication token");
	}
};
