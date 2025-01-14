import mongoose, { Schema } from "mongoose";

const inventorySchema = new mongoose.Schema(
	{
		inventoryType: {
			type: String,
			required: true,
			enum: ["In", "Out"],
		},

		bloodGroup: {
			type: String,
			required: true,
			enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
		},

		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		donor: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: function () {
				return this.inventoryType === "In";
			},
		},
		hospital: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: function () {
				return this.inventoryType === "Out";
			},
		},
		organization: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
