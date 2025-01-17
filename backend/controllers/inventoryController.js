import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";
import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";

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
			throw new CustomError(400, false, "All fields are required.");
		}

		// console.log("donor: ", donor)
		// console.log("hospital:", hospital)
		// console.log("inventory type: ", inventoryType)

		if (inventoryType === "In" && !donor) {
			throw new CustomError(400, false, "donor email is required.");
		}

		if (inventoryType === "Out" && !hospital) {
			throw new CustomError(400, false, "hospital email is required.");
		}

		// Check if quantity is a positive number
		if (quantity <= 0) {
			throw new CustomError(400, false, "Quantity must be a positive value.");
		}

		//when consuming blood , total_out value must be less than total_in value of blood

		if (inventoryType === "Out") {
			const organizationId = new mongoose.Types.ObjectId(req.user.userId);
			console.log("organization: ", organizationId);

			const results = await Inventory.aggregate([
				{
					$match: {
						bloodGroup: bloodGroup,
						organization: organizationId,
					},
				},

				{
					$group: {
						_id: "$inventoryType",
						total: { $sum: "$quantity" },
					},
				},

				{
					$addFields: {
						bloodGroup: bloodGroup,
					},
				},
			]);

			console.log("aggregation results: ", results);

			const data = {
				totalIn: results.find((r) => r._id === "In")?.total || 0,
				totalOut: results.find((r) => r._id === "Out")?.total || 0,
				totalAvailable:
					(results.find((r) => r._id === "In")?.total || 0) -
					(results.find((r) => r._id === "Out")?.total || 0),
			};

			if (quantity > data.totalAvailable) {
				throw new CustomError(
					400,
					false,
					`only ${data.totalAvailable} ML of ${bloodGroup} is available`
				);
			}
		}

		// Check inventoryType validity
		if (!["In", "Out"].includes(inventoryType)) {
			throw new CustomError(400, false, "Invalid inventory type.");
		}

		// Find user for hospital, donor, or organization reference
		let donorOrHospitalUser;

		if (inventoryType === "In") {
			donorOrHospitalUser = await User.findOne({ email: donor });
			if (!donorOrHospitalUser) {
				throw new CustomError(
					404,
					false,
					"donor with the given email not found."
				);
			}
		} else if (inventoryType === "Out") {
			donorOrHospitalUser = await User.findOne({ email: hospital });
			if (!donorOrHospitalUser) {
				throw new CustomError(
					404,
					false,
					"hospital with the given email not found."
				);
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
			success: true,
			message: "Inventory added successfully.",
			data: {
				inventory: newInventory,
				donorOrHospitalUser,
			},
		});
	} catch (error) {
		console.error("Error adding inventory:", error);
		next(error);
	}
};

export const getInventories = async (req, res, next) => {
	const limit = parseInt(req.query.limit);

	try {
		const inventories = await Inventory.find({
			organization: req.user.userId,
		})
			.sort({ createdAt: -1 }) // Sort by creation date in descending order (latest first)
			.limit(limit) // Limit the number of results
			.populate("donor hospital organization");
		// Fetch all inventories of logged in organization

		if (!inventories) {
			throw new CustomError(400, false, "Inventories not found.");
		}

		res.status(200).json({
			success: true,
			message: "Inventory fetched successfully.",
			data: {
				inventories,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const getDonations = async (req, res, next) => {
	const limit = parseInt(req.query.limit);

	try {
		const donations = await Inventory.find({ donor: req.user.userId })
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate("donor hospital organization");
		// Fetch all donations of logged in organization

		if (!donations) {
			throw new CustomError(400, false, "No Donation records found");
		}

		res.status(200).json({
			success: true,
			message: "Inventory fetched successfully.",
			data: {
				donations,
			},
		});
	} catch (error) {
		console.log("error: ", error);
		next(error);
	}
};

export const getConsumptions = async (req, res, next) => {
	const limit = parseInt(req.query.limit);

	try {
		const consumptions = await Inventory.find({
			hospital: req.user.userId,
		})
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate("donor hospital organization");
		// Fetch all consumptions of logged in organization

		if (!consumptions) {
			throw new CustomError(400, false, "No Consumption records found");
		}

		res.status(200).json({
			success: true,
			message: "Consumptions Inventory fetched successfully.",
			data: {
				consumptions,
			},
		});
	} catch (error) {
		console.log("error: ", error);
		next(error);
	}
};

export const getBloodGroupsData = async (req, res, next) => {
	const { bloodGroup } = req.body;

	// Validate and convert organization ID to ObjectId
	if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
		throw new CustomError(400, false, "Invalid organization ID");
	}

	const organization = new mongoose.Types.ObjectId(req.user.userId);

	console.log("organization: ", organization);

	try {
		const results = await Inventory.aggregate([
			{
				$match: {
					bloodGroup: bloodGroup,
					organization: organization,
				},
			},

			{
				$group: {
					_id: "$inventoryType",
					total: { $sum: "$quantity" },
				},
			},

			{
				$addFields: {
					bloodGroup: bloodGroup,
				},
			},
		]);

		console.log("aggregation results: ", results);

		const data = {
			totalIn: results.find((r) => r._id === "In")?.total || 0,
			totalOut: results.find((r) => r._id === "Out")?.total || 0,
			totalAvailable:
				(results.find((r) => r._id === "In")?.total || 0) -
				(results.find((r) => r._id === "Out")?.total || 0),
		};

		console.log("data: ", data);

		res.status(200).json({
			success: true,
			message: "blood groups data fetched successfully.",
			data: {
				bloodGroupsData: data,
				results,
			},
		});
	} catch (error) {
		console.log("error: ", error);
		next(error);
	}
};
