import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongoDB } from "./mongoDB/connectMongoDB.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//test routes
app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to Blood Bank API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
	// MongoDB Connection
	await connectMongoDB();
	console.log(`Server running on port ${PORT}`);
});
