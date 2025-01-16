import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/auth/authApi";
import { resetAuthState } from "../../redux/auth/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OrganizationDashboardPage from "./Organization/OrganizationDashboardPage";
import DonorHospitalDashboard from "./Donor_Hospital/DonorHospitalDashboard";

const Dashboard = () => {
	const { loading, error, success, currentUser } = useSelector(
		(state) => state.auth
	);

	return (
		<div>
			{currentUser.userType === "organization" ? (
				<OrganizationDashboardPage />
			) : (
				<DonorHospitalDashboard />
			)}
		</div>
	);
};

export default Dashboard;
