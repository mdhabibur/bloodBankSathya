import { Tabs } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Inventory from "./organization/InventoryPage";
import Donors from "./organization/DonorsPage";
import Hospitals from "./organization/HospitalPage";
import Donations from "./donor/DonationsPage";
import Consumptions from "./hospital/ConsumptionsPage";
import Organizations from "./OrganizationsPage";

const Profile = () => {
	const { loading, error, success, currentUser } = useSelector(
		(state) => state.auth
	);

	const userType = currentUser.userType;

	const getTabs = () => {
		if (userType === "organization") {
			return [
				{ key: "inventory", label: "Inventory", children: <Inventory /> },
				{ key: "donors", label: "Donors", children: <Donors /> },
				{
					key: "hospitals",
					label: "Hospitals",
					children: <Hospitals />,
				},
			];
		} else if (userType === "donor") {
			return [
				{
					key: "donations",
					label: "Donations",
					children: <Donations />,
				},
				{
					key: "organizations",
					label: "Organizations",
					children: <Organizations />,
				},
			];
		} else if (userType === "hospital") {
			return [
				{
					key: "consumptions",
					label: "Consumptions",
					children: <Consumptions />,
				},
				{
					key: "organizations",
					label: "Organizations",
					children: <Organizations />,
				},
			];
		}
		return [];
	};

	const tabs = getTabs();

	return (
		<div className="p-4 custom-tabs">
			<Tabs defaultActiveKey="inventory" items={tabs} />
		</div>
	);
};

export default Profile;
