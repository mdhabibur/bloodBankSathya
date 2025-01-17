import Inventory from "../models/Inventory.js";
import CustomError from "../utils/CustomError.js";

export const getHospitals = async (req, res, next) => {
	try {
		const hospitals = await Inventory.find({
			organization: req.user.userId,
			inventoryType: "Out",
		}).populate("donor hospital organization");

		if (!hospitals) {
			throw new CustomError(400, false, "No hospitals found");
		}

		// Fetch all hospitals in organization
		res.status(200).json({
			success: true,
			message: "hospitals fetched successfully.",
			data: {
				hospitals,
			},
		});
	} catch (error) {
		next(error);
	}
};
