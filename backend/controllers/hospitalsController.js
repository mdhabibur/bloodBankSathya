import Inventory from "../models/Inventory.js";

export const getHospitals = async (req, res, next) => {
	try {
		const hospitals = await Inventory.find({
			organization: req.user.userId,
			inventoryType: "Out",
		}).populate("donor hospital organization");

		// Fetch all hospitals in organization
		res.status(200).json({
			success: true,
			message: "hospitals fetched successfully.",
			data: {
				hospitals,
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Failed to fetch hospitals" });
	}
};
