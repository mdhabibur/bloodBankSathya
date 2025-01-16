import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetInventoryState } from "../../../../redux/inventory/inventorySlice";
import moment from "moment";
import InventoryTable from "../../../../components/inventory/InventoryTable";
import { fetchConsumptionRecords } from "../../../../redux/inventory/inventoryApi";
import toast from "react-hot-toast";

const Consumptions = () => {
	const {
		loading,
		error,
		success,
		inventoryRecord,
		inventories,
		donationRecords,
    consumptionRecords
	} = useSelector((state) => state.inventory);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	//fetch inventories

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
		fetchConsumptionRecordsFunction();
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
			<InventoryTable records={consumptionRecords} columns={columns} />
		</div>
	);
};

export default Consumptions;
