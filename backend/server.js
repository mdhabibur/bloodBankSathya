import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongoDB } from "./mongoDB/connectMongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js"
import donorsRoutes from "./routes/donorsRoutes.js"
import hospitalsRoutes from "./routes/hospitalsRoutes.js"
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import path from "path";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
// Required to parse cookies


// Backend Routes

//test routes

// app.get("/", (req, res) => {
// 	res.status(200).json({ message: "Welcome to Blood Bank API" });
// });


app.use("/api/auth", authRoutes);

//for organizations user type
app.use("/api/inventories", inventoryRoutes);
app.use("/api/donors", donorsRoutes)
app.use("/api/hospitals", hospitalsRoutes)
app.use("/api/blood-groups", inventoryRoutes)

//for donor user type
app.use("/api/donors", inventoryRoutes);

//for hospital user type
app.use("/api/hospitals", inventoryRoutes);



//frontend routes (for production) as in production both backend and frontend domain will be run under a single domain and single server

if (process.env.NODE_ENV === "production") {
	const __dirname = path.resolve();
	//get current directory location

	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	//serving static production build 'dist' folder for frontend

	//for any route other than /api route, serve the static files from frontend
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}



//Error Handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
	// MongoDB Connection
	await connectMongoDB();
	console.log(`Server running on port ${PORT}`);
});
