import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongoDB } from "./mongoDB/connectMongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js"
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
// Required to parse cookies


// Routes

//test routes
app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to Blood Bank API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);


//Error Handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
	// MongoDB Connection
	await connectMongoDB();
	console.log(`Server running on port ${PORT}`);
});
