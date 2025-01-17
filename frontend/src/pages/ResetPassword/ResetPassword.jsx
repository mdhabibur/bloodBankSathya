import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { resetAuthState } from "../../redux/auth/authSlice";
import Input from "../../components/Input";
import { resetPassword } from "../../redux/auth/authApi";

const ResetPassword = () => {
	const { loading, error, success, currentUser } = useSelector(
		(state) => state.auth
	);

	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});

	const { password, confirmPassword } = formData;

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { token } = useParams();

	const handleFieldChange = async (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		try {
			dispatch(
				resetPassword({
					url: `/api/auth/reset-password/${token}`,
                    formData,
					method: "POST",
					headers: { "Content-Type": "application/json" },
				})
			);
		} catch (error) {
			//frontend error
			console.log("frontend Error: ", error);
			toast.error(error.message || "Error resetting password");
		}
	};

	useEffect(() => {
		//timer object
		let timer;
		if (error || success) {
			if (success) {
				toast.success(success);
				timer = setTimeout(() => {
					dispatch(resetAuthState());
					navigate("/signin");
				}, 3000);

				return;
			}

			timer = setTimeout(() => {
				dispatch(resetAuthState());
			}, 3000);
		}

		//cleanup timer on unmount
		return () => clearTimeout(timer);
	}, [error, success, dispatch, navigate]);
	return (
		<div className="max-w-md w-full min-h-screen flex items-center justify-center mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md w-full bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
			>
				<div className="p-8">
					<h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
						Reset Password
					</h2>

					{error && toast.error(error)}

					<form onSubmit={handleSubmit}>
						<Input
							icon={Lock}
							type="password"
							name="password"
							placeholder="New Password"
							value={password}
							onChange={handleFieldChange}
							required
						/>

						<Input
							icon={Lock}
							type="password"
							name="confirmPassword"
							placeholder="Confirm New Password"
							value={confirmPassword}
							onChange={handleFieldChange}
							required
						/>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
							type="submit"
							disabled={loading}
						>
							{loading ? "Resetting..." : "Set New Password"}
						</motion.button>
					</form>
				</div>
			</motion.div>
		</div>
	);
};

export default ResetPassword;
