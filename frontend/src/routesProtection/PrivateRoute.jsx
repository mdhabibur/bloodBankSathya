import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logOutUser } from "../redux/auth/authApi";
import { resetAuthState } from "../redux/auth/authSlice";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { FaUserCircle } from "react-icons/fa"; // User profile icon

const PrivateRoute = ({ children }) => {
	const { loading, error, success, currentUser } = useSelector(
		(state) => state.auth
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Logout handler
	const handleLogout = (e) => {
		e.preventDefault();

		try {
			dispatch(
				logOutUser({
					url: "api/auth/logout",
					method: "POST",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	useEffect(() => {
		//timer object
		let timer;
		if (error || success) {
			if (success) {
				dispatch(resetAuthState());
				navigate("/signin");
				toast.success(success);
				return;
			}

			timer = setTimeout(() => {
				dispatch(resetAuthState());
			}, 3000);
		}

		//cleanup timer on unmount
		return () => clearTimeout(timer);
	}, [error, success, dispatch, navigate]);

	if (!currentUser) {
		return <Navigate to="/signin" />;
	}


	const navigateToProfile = () => {
		navigate("/profile")
	}

	return (
		<div className="min-h-screen flex flex-col bg-primary">
			{/* Header */}
			<header className="bg-red-700 text-white p-4 flex justify-between items-center shadow">
				<div className="flex flex-col gap-2">
					<h1 className="text-lg font-bold text-teal-400">BLOOD_LIFE</h1>
					<h3 className="uppercase font-semibold text-xs ">
						{currentUser.userType}
					</h3>
				</div>

				{/* User Profile and Logout */}
				<div className="flex items-center gap-4">
					{/* User Profile */}
					<div className="flex items-center gap-2 cursor-pointer" onClick={navigateToProfile}>
						<FaUserCircle className="text-xl" />
						<span className="font-medium">{currentUser.username}</span>
					</div>

					{/* Logout */}
					<button
						onClick={handleLogout}
						className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
					>
						<FiLogOut className="text-red-800 text-xs" />
					</button>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-grow">{children}</main>
		</div>
	);
};

export default PrivateRoute;
