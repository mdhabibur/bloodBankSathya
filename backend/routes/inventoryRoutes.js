import express from "express";
import { addInventory, getInventories, getDonations, getConsumptions, getBloodGroupsData } from "../controllers/inventoryController.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = express.Router();

// Route for inventory
router.post("/add", verifyToken, addInventory);
router.get("/get", verifyToken, getInventories)

router.post("/fetch-data", verifyToken, getBloodGroupsData)

//for donors
router.get("/donations/get", verifyToken, getDonations)

//for hospitals
router.get("/consumptions/get", verifyToken, getConsumptions)



export default router;