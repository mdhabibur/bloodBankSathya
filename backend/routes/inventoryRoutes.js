import express from "express";
import { addInventory, getInventories } from "../controllers/inventoryController.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = express.Router();

// Route for inventory
router.post("/add", verifyToken, addInventory);
router.get("/get", verifyToken, getInventories)


export default router;