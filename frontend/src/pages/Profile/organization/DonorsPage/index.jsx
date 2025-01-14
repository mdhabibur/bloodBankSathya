import React, { useEffect } from "react";
import InventoryTable from "../../../../components/inventory/InventoryTable";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDonors } from "../../../../redux/inventory/inventoryApi";

const Donors = () => {
	const { loading, error, success, inventoryRecord, inventories, donors } =
		useSelector((state) => state.inventory);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	//fetch inventories
	const fetchDonorsFunction = () => {
		try {
			dispatch(
				fetchDonors({
					url: "/api/donors/get",
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	useEffect(() => {
		fetchDonorsFunction();
	}, [dispatch]);

	{
		console.log("donors: ", donors);
	}

	//columns for inventory table

	//format date using moment package
	const formatDate = (date) => moment(date).format("DD-MM-YYYY, hh:mm A");

	const columns = [
		{
			title: "Username",
			key: "type",
			render: (record) =>
				record.inventoryType === "In"
					? record.donor?.username
					: record.hospital?.username,
		},

		{
			title: "Email",
			key: "type",
			render: (record) =>
				record.inventoryType === "In"
					? record.donor?.email
					: record.hospital?.email,
		},

		{
			title: "Blood Group",
			dataIndex: "bloodGroup",
			key: "bloodGroup",
		},

		{
			title: "phone",
			key: "phone",
			render: (record) =>
				record.inventoryType === "In"
					? record.donor?.phone
					: record.hospital?.phone,
		},
		{
			title: "Date",
			key: "date",
			render: (record, text) => {
				const donors_createdAt =
					record.inventoryType === "In"
						? record.donor?.createdAt
						: record.hospital?.createdAt;

				const donors_createdAt_formattedDate = formatDate(donors_createdAt);

				return donors_createdAt_formattedDate;
			},
		},
	];

	return <InventoryTable records={donors} columns={columns} />;
};

export default Donors;
