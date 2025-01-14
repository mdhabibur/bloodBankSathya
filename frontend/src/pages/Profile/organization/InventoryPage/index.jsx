import { Button, Form } from "antd";
import React, { useEffect, useState } from "react";
import InventoryTable from "../../../../components/inventory/InventoryTable";
import AddInventoryRecordModal from "./AddInventoryRecordModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	addInventory,
	fetchInventories,
} from "../../../../redux/inventory/inventoryApi";
import { resetInventoryState } from "../../../../redux/inventory/inventorySlice";
import toast from "react-hot-toast";
import moment from "moment";

const Inventory = () => {
	const { loading, error, success, inventoryRecord, inventories } = useSelector(
		(state) => state.inventory
	);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [inventoryType, setInventoryType] = useState("In");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	//fetch inventories

	const fetchInventoriesFunction = () => {
		try {
			dispatch(
				fetchInventories({
					url: "/api/inventories/get",
					method: "GET",
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	useEffect(() => {
		fetchInventoriesFunction();
	}, [dispatch]);

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields(); // Reset form fields on cancel
	};

	const handleOk = () => {
		form
			.validateFields()
			.then((formData) => {
				console.log("Form Values: ", formData);
				// Replace this with API dispatch later

				dispatch(
					addInventory({
						url: "/api/inventories/add",
						formData,
						method: "POST",
						headers: { "Content-Type": "application/json" },
					})
				)
					.then(() => {
						console.log("Inventory added successfully");
						fetchInventoriesFunction();
						setIsModalOpen(false);
						// form.resetFields();
					})
					.catch((error) => {
						console.error("frontend Error: ", error);
					});
			})
			.catch((info) => {
				console.error("Validation Failed: ", info);
			});
	};

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

	const handleInventoryTypeChange = (e) => {
		setInventoryType(e.target.value);
	};

	{
		console.log("inventory record: ", inventoryRecord);
	}

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
			<div className="flex justify-end mb-4">
				<Button type="primary" onClick={showModal}>
					Add Inventory
				</Button>
			</div>

			{error && toast.error(error)}

			{isModalOpen && (
				<AddInventoryRecordModal
					isModalOpen={isModalOpen}
					handleOk={handleOk}
					handleCancel={handleCancel}
					form={form}
					handleInventoryTypeChange={handleInventoryTypeChange}
					inventoryType={inventoryType}
				/>
			)}

			<InventoryTable inventories={inventories} columns={columns} />
		</div>
	);
};

export default Inventory;
