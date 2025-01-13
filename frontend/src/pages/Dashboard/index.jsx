import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/auth/authApi";
import { resetAuthState } from "../../redux/auth/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const { loading, error, success } = useSelector((state) => state.auth);


	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	);
};

export default Dashboard;
