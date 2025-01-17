import Inventory from "../models/Inventory.js";
import CustomError from "../utils/CustomError.js";

export const getDonors = async (req, res, next) => {
	try {
		const donors = await Inventory.find({
			organization: req.user.userId,
			inventoryType: "In",
		}).populate("donor hospital organization");

		if (!donors) {
			throw new CustomError(400, false, "No Donors Found");
		}

		// Fetch all donors in organization
		res.status(200).json({
			success: true,
			message: "Donors fetched successfully.",
			data: {
				donors,
			},
		});
	} catch (error) {
		next(error);
	}
};
