import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchConsumptionRecords, fetchDonationRecords } from "../../../redux/inventory/inventoryApi";
import { resetInventoryState } from "../../../redux/inventory/inventorySlice";
import toast from "react-hot-toast";
import moment from "moment";
import InventoryTable from "../../../components/inventory/InventoryTable";

const DonorHospitalDashboard = () => {

    const {currentUser} = useSelector((state) => state.auth)
	const {
		loading,
		error,
		success,
		inventoryRecord,
		inventories,
		donationRecords,
		consumptionRecords,
	} = useSelector((state) => state.inventory);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	//fetch inventories

	const fetchDonationRecordsFunction = (limit = 5) => {
		try {
			dispatch(
				fetchDonationRecords({
					url: `/api/donors/donations/get?limit=${limit}`,
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	//fetch consumptions records
	const fetchConsumptionRecordsFunction = (limit=5) => {
		try {
			dispatch(
				fetchConsumptionRecords({
					url: `/api/hospitals/consumptions/get?limit=${limit}`,
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	useEffect(() => {
		if (currentUser.userType === "donor") {
			fetchDonationRecordsFunction(5); //fetch latest 5 records
		} else {
			fetchConsumptionRecordsFunction(5);
		}
	}, [dispatch]);

	useEffect(() => {
		//timer object
		let timer;
		if (error || success) {
			if (success) {
				dispatch(resetInventoryState());
				toast.success(success);
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
		<div>
			{currentUser.userType === "donor" ? (
				<InventoryTable records={donationRecords} columns={columns} />
			) : (
				<InventoryTable records={consumptionRecords} columns={columns} />
			)}
		</div>
	);
};

export default DonorHospitalDashboard;
