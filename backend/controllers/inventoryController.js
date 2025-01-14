import Inventory from "../models/Inventory.js";
import User from "../models/User.js";

export const addInventory = async (req, res, next) => {
	const { inventoryType, bloodGroup, quantity } = req.body;

	const organization = req.user.userId;

	let donor;
	let hospital;

	if (inventoryType === "In") {
		donor = req.body.donor;
	}
	if (inventoryType === "Out") {
		hospital = req.body.hospital;
	}

	try {
		// Validate fields
		if (!inventoryType || !bloodGroup || !quantity || !organization) {

        return res.status(400).json({success: false, message: "All fields are required." });

		}

        // console.log("donor: ", donor)
        // console.log("hospital:", hospital)
        // console.log("inventory type: ", inventoryType)

        if (inventoryType === "In" && !donor) {
            return res.status(400).json({success: false, message: "donor email is required." });
        }

        if (inventoryType === "Out" && !hospital) {
            return res.status(400).json({success: false, message: "hospital email is required." });
        }

		// Check if quantity is a positive number
		if (quantity <= 0) {
			return res
				.status(400)
				.json({success: false, message: "Quantity must be a positive value." });
		}

		// Check inventoryType validity
		if (!["In", "Out"].includes(inventoryType)) {
			return res.status(400).json({success: false, message: "Invalid inventory type." });
		}

		// Find user for hospital, donor, or organization reference
		let donorOrHospitalUser;
		if (inventoryType === "In") {
			donorOrHospitalUser = await User.findOne({ email: donor });
			if (!donorOrHospitalUser) {
				return res
					.status(404)
					.json({success: false, message: "donor with the given email not found." });
			}
		} else if (inventoryType === "Out") {
			donorOrHospitalUser = await User.findOne({ email: hospital });
			if (!donorOrHospitalUser) {
				return res
					.status(404)
					.json({success: false, message: "hospital with the given email not found." });
			}
		}

		// Create the inventory object
		const inventoryData = {
			inventoryType,
			bloodGroup,
			quantity,
			timestamp: new Date(),
			organization,
		};

		if (inventoryType === "In") {
			inventoryData.donor = donorOrHospitalUser._id;
		} else if (inventoryType === "Out") {
			inventoryData.hospital = donorOrHospitalUser._id;
		}

		// Save the inventory record
		const newInventory = new Inventory(inventoryData);
		await newInventory.save();

		res.status(201).json({
			message: "Inventory added successfully.",
			data: {
				inventory: newInventory,
                donorOrHospitalUser
			},
		});
	} catch (error) {
		console.error("Error adding inventory:", error);
		res.status(500).json({success: false, message: "Internal server error." });
	}
};
