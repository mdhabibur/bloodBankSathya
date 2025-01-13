import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/auth/authApi";
import { resetAuthState } from "../../redux/auth/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const { loading, error, success } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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

	return (
		<div>
			<h1>Dashboard</h1>
			<button className="bg-primary button border-2" onClick={handleLogout}>
				logout
			</button>
		</div>
	);
};

export default Dashboard;
