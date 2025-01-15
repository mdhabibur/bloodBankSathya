import React, { useEffect } from "react";
import InventoryTable from "../../../../components/inventory/InventoryTable";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHospitals } from "../../../../redux/inventory/inventoryApi";


const Hospitals = () => {
	const { loading, error, success, inventoryRecord, inventories, donors, hospitals } =
		useSelector((state) => state.inventory);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	//fetch inventories
	const fetchHospitalsFunction = () => {
		try {
			dispatch(
				fetchHospitals({
					url: "/api/hospitals/get",
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	useEffect(() => {
		fetchHospitalsFunction();
	}, [dispatch]);

	{
		console.log("hospitals: ", hospitals);
	}

	//columns for inventory table

	//format date using moment package
	const formatDate = (date) => moment(date).format("DD-MM-YYYY, hh:mm A");

	const columns = [
		{
			title: "Hospital Name",
			key: "type",
			render: (record) =>
				record.inventoryType === "Out"
					? record.hospital?.hospitalName
					: "Hospital Name",
		},

		{
			title: "Email",
			key: "type",
			render: (record) =>
				record.inventoryType === "Out"
					? record.hospital?.email
					: "Hospital Email",
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
				record.inventoryType === "Out"
					? record.hospital?.phone
					: "Hospital Phone",
		},
		{
			title: "Date",
			key: "date",
			render: (record, text) => {
				const hospital_createdAt =
						record.inventoryType === "Out"
						? record.hospital?.createdAt
						: "Hospital createdAt Date"

				const hospital_createdAt_formattedDate = formatDate(hospital_createdAt);

				return hospital_createdAt_formattedDate;
			},
		},
	];

	return <InventoryTable records={hospitals} columns={columns} />;
}

export default Hospitals