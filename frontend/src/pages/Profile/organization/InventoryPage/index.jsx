import { Button, Form } from "antd";
import React, { useEffect, useState } from "react";
import InventoryTable from "../../../../components/inventory/InventoryTable";
import AddInventoryRecordModal from "./AddInventoryRecordModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addInventory } from "../../../../redux/inventory/inventoryApi";
import { resetInventoryState } from "../../../../redux/inventory/inventorySlice";
import toast from "react-hot-toast";

const Inventory = () => {

  const {loading, error, success, inventoryRecord} = useSelector((state) => state.inventory)

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [inventoryType, setInventoryType] = useState("In");

	const dispatch = useDispatch();
	const navigate = useNavigate();

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
						url: "/api/inventory/add",
						formData,
						method: "POST",
						headers: { "Content-Type": "application/json" },
					})
				)
					.then(() => {
            console.log("Inventory added successfully");
						// setIsModalOpen(false);
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


  {console.log("inventory record: ", inventoryRecord)}

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

			<InventoryTable />
		</div>
	);
};

export default Inventory;
