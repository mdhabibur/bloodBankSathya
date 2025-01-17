import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	fetchConsumptionRecords,
	fetchDonationRecords,
} from "../../../redux/inventory/inventoryApi";
import toast from "react-hot-toast";
import { resetInventoryState } from "../../../redux/inventory/inventorySlice";
import moment from "moment";
import InventoryTable from "../../../components/inventory/InventoryTable";

const Organizations = () => {
	const {
		loading,
		error,
		success,
		inventoryRecord,
		inventories,
		donationRecords,
		consumptionRecords,
	} = useSelector((state) => state.inventory);

	const { currentUser } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	//fetch donations records
	const fetchDonationRecordsFunction = () => {
		try {
			dispatch(
				fetchDonationRecords({
					url: "/api/donors/donations/get",
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	//fetch consumptions records
	const fetchConsumptionRecordsFunction = () => {
		try {
			dispatch(
				fetchConsumptionRecords({
					url: "/api/hospitals/consumptions/get",
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	useEffect(() => {
		if (currentUser.userType === "donor") {
			fetchDonationRecordsFunction();
		} else {
			fetchConsumptionRecordsFunction();
		}
	}, [dispatch]);

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
		{
			title: "Organization Name",
			key: "organizationName",
			render: (record) => record.organization?.organizationName,
		},

		{
			title: "Email",
			key: "email",
			render: (record) => record.organization?.email,
		},

		{
			title: "phone",
			key: "phone",
			render: (record) => record.organization?.phone,
		},
		{
			title: "Website",
			key: "website",
			render: (record) => record.organization?.website,
		},
		{
			title: "Date",
			key: "date",
			render: (record) => record.organization?.createdAt,
		},
		{
			title: "Action",
			key: "action",
		},
	];

	return (
		<div>
			{error && toast.error(error)}

			{currentUser.userType === "donor" ? (
				<InventoryTable records={donationRecords} columns={columns} />
			) : (
				<InventoryTable records={consumptionRecords} columns={columns} />
			)}
		</div>
	);
};

export default Organizations;
