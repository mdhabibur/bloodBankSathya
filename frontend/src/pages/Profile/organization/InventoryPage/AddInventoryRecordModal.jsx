import { Button, Modal, Form, Input, Radio, Select } from "antd";
import React from "react";
import {
	emailValidationRule,
	requiredFieldRule,
} from "../../../../../utils/formValidationRule";

const AddInventoryRecordModal = ({
	isModalOpen,
	handleOk,
	handleCancel,
	form,
	handleInventoryTypeChange,
	inventoryType,
}) => {
	return (
		<Modal
			title="Add Inventory"
			open={isModalOpen}
			onOk={handleOk}
			onCancel={handleCancel}
			okText="Add"
			cancelText="Cancel"
		>
			<Form form={form} layout="vertical">
				{/* Inventory Type Field */}
				<Form.Item
					label="Inventory Type"
					name="inventoryType"
					rules={[requiredFieldRule("Please select inventory type!")]}
				>
					<Radio.Group onChange={handleInventoryTypeChange}>
						<Radio value="In">In</Radio>
						<Radio value="Out">Out</Radio>
					</Radio.Group>
				</Form.Item>

				{/* Blood Group Field */}
				<Form.Item
					label="Blood Group"
					name="bloodGroup"
					rules={[requiredFieldRule("Please select a blood group!")]}
				>
					<Select placeholder="Select a blood group">
						{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
							<Select.Option key={group} value={group}>
								{group}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{/* Hospital/Donor Email Field */}
				<Form.Item
					label={inventoryType === "In" ? "Donor Email" : "Hospital Email"}
					name={inventoryType === "In" ? "donor" : "hospital"}
					rules={[
						requiredFieldRule(
							`Please enter ${
								inventoryType === "In" ? "donor" : "hospital"
							} email!`
						),

						emailValidationRule("Please enter a valid email address!"),
					]}
				>
					<Input placeholder="Enter email" />
				</Form.Item>

				{/* Quantity Field */}
				<Form.Item
					label="Quantity (ML)"
					name="quantity"
					rules={[
						requiredFieldRule("Please enter quantity!"),
						{
							pattern: /^[1-9]\d*$/,
							message: "Quantity must be a positive number!",
						},
					]}
				>
					<Input placeholder="Enter quantity in milliliters" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddInventoryRecordModal;
