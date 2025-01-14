import Inventory from "../models/Inventory.js";

export const getDonors = async (req, res, next) => {
	try {
		const donors = await Inventory.find({
			organization: req.user.userId,
			inventoryType: "In",
		}).populate("donor hospital organization");

		// Fetch all donors in organization
		res.status(200).json({
			success: true,
			message: "Donors fetched successfully.",
			data: {
				donors,
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Failed to fetch donors" });
	}
};
