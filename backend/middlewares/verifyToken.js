import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	try {
		// Retrieve token from cookies
		const token = req.cookies?.token;

		// Check if the token exists
		if (!token) {
			return res
				.status(401)
				.json({success: false, message: "Access Denied: No token provided." });
		}

		// Verify the token
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(403).json({success: false, message: "Invalid or expired token." });
			}

			// Set user data to req.user
			req.user = decoded;
			next(); // Proceed to the next middleware or controller
		});
	} catch (error) {
		console.error("Error in verify Token :", error);
		res.status(500).json({success: false, message: "Internal server error." });
	}
};

export default verifyToken;
