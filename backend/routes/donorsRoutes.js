import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getDonors } from "../controllers/donorsController.js";

const router = express.Router();

// Route for inventory
router.get("/get", verifyToken, getDonors)


export default router;