import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getHospitals } from "../controllers/hospitalsController.js";


const router = express.Router();

// Route for inventory
router.get("/get", verifyToken, getHospitals)


export default router;