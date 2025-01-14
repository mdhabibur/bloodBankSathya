import express from "express";
import { addInventory } from "../controllers/inventoryController.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = express.Router();

// Route for inventory
router.post("/add", verifyToken, addInventory);


export default router;