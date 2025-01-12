import bcrypt from "bcryptjs";
import User from "../models/User.js";

// User sign-up controller
export const signUpUser = async (req, res) => {
  const { username, email, password, phone, userType, hospitalName, website, organizationName } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      userType,
      hospitalName: userType === "hospital" ? hospitalName : undefined,
      website: (userType === "hospital" || userType === "organization") ? website : undefined,
      organizationName: userType === "organization" ? organizationName : undefined,
    });

    await newUser.save();

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
      }

    });
  } catch (error) {
    console.error("Error in signUpUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
