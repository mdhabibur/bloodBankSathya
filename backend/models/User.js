import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String, required: true },
		userType: {
			type: String,
			enum: ["donor", "hospital", "organization"],
			required: true,
		},

		hospitalName: {
			type: String,
			required: function () {
				return this.userType === "hospital";
			},
		},
		website: {
			type: String,
			required: function () {
				return this.userType === "hospital" || this.userType === "organization";
			},
		},
		organizationName: {
			type: String,
			required: function () {
				return this.userType === "organization";
			},
		},

		// Email verification fields
		verificationCode: { type: String },
		verificationCodeExpires: { type: Date },
		isEmailVerified: { type: Boolean, default: false },
	},

	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);
export default User;
