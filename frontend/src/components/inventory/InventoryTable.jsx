import { Table } from "antd";
import React from "react";

const InventoryTable = () => {
	const columns = [
		{ title: "Inventory Type", dataIndex: "inventoryType", key: "type" },
		{ title: "Blood Group", dataIndex: "bloodGroup", key: "bloodGroup" },
		{ title: "Quantity", dataIndex: "quantity", key: "quantity" },
		{ title: "Reference", dataIndex: "reference", key: "reference" },
		{ title: "Date", dataIndex: "date", key: "date" },
	];

	const data = [];

	return <Table columns={columns} dataSource={data} />;
};

export default InventoryTable;
