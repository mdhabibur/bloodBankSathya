import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
	fetchBloodGroupData,
	fetchInventories,
} from "../../../redux/inventory/inventoryApi";
import InventoryTable from "../../../components/inventory/InventoryTable";
import moment from "moment";
import { resetInventoryState } from "../../../redux/inventory/inventorySlice";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const OrganizationDashboardPage = () => {

	const { bloodData, loading, error, success, inventories } = useSelector(
		(state) => state.inventory
	);

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const fetchInventoriesFunction = (limit = 5) => {
		try {
			dispatch(
				fetchInventories({
					url: `/api/inventories/get?limit=${limit}`,
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	const fetchBloodGroupDataFunction = () => {
		try {
			dispatch(
				fetchBloodGroupData({
					url: "/api/blood-groups/fetch-data",
					method: "POST",
					headers: { "Content-Type": "application/json" },
				})
			);
		} catch (err) {
			console.error("Frontend Error:", err);
		}
	};

	useEffect(() => {
		fetchInventoriesFunction(5); //fetch only latest 5 records
		fetchBloodGroupDataFunction();
	}, [dispatch]);

	const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

	console.log("blood group data: ", bloodData);

	useEffect(() => {
		//timer object
		let timer;
		if (error || success) {
			if (success) {
				dispatch(resetInventoryState());
				// toast.success(success);
				return;
			}

			timer = setTimeout(() => {
				dispatch(resetInventoryState());
			}, 3000);
		}

		//cleanup timer on unmount
		return () => clearTimeout(timer);
	}, [error, success, dispatch, navigate]);

	//columns for inventory table

	//format date using moment package
	const formatDate = (date) => moment(date).format("DD-MM-YYYY, hh:mm A");

	const columns = [
		{ title: "Inventory Type", dataIndex: "inventoryType", key: "type" },
		{ title: "Blood Group", dataIndex: "bloodGroup", key: "bloodGroup" },
		{ title: "Quantity", dataIndex: "quantity", key: "quantity" },
		{
			title: "Reference",
			key: "reference",
			render: (record) =>
				record.inventoryType === "In"
					? record.donor?.email
					: record.hospital?.email,
		},
		{
			title: "Date",
			dataIndex: "createdAt",
			key: "date",
			render: (text) => formatDate(text),
		},
	];

	return (
		<div className="p-4">
			{loading && <Loader className="animate-spin mx-auto" size={60} />}
			{error && toast.err(error)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{bloodGroups.map((group, index) => {
					const groupData = bloodData[index] || {};

					return (
						<div
							key={group}
							className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between border-l-4 border-red-500"
						>
							<h2 className="text-xl font-bold text-red-500">{group}</h2>
							<div className="mt-4">
								<p>
									<strong>Total Blood In:</strong> {groupData.totalIn || 0}
								</p>
								<p>
									<strong>Total Blood Out:</strong> {groupData.totalOut || 0}
								</p>
								<p>
									<strong>Total Blood Available:</strong>{" "}
									{groupData.totalAvailable || 0}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			<h1 className="text-2xl font-semibold mt-6 mb-3 mx-1">
				Your Recent Inventory
			</h1>

			<InventoryTable records={inventories} columns={columns} />
		</div>
	);
};

export default OrganizationDashboardPage;
