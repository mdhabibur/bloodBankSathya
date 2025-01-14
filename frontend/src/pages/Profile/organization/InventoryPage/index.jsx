import { Button, Form } from "antd";
import React, { useState } from "react";
import InventoryTable from "../../../../components/inventory/InventoryTable";
import AddInventoryRecordModal from "./AddInventoryRecordModal";

const Inventory = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [inventoryType, setInventoryType] = useState("In");

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
			.then((values) => {
				console.log("Form Values: ", values); 
        // Replace this with API dispatch later

				// setIsModalOpen(false);
				// form.resetFields();
			})
			.catch((info) => {
				console.error("Validation Failed: ", info);
			});
	};

	const handleInventoryTypeChange = (e) => {
		setInventoryType(e.target.value);
	};

	return (
		<div>
			<div className="flex justify-end mb-4">
				<Button type="primary" onClick={showModal}>Add Inventory</Button>
			</div>

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

			<InventoryTable />
		</div>
	);
};

export default Inventory;
