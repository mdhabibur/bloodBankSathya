import { Table } from "antd";
import moment from "moment";
import React, { useMemo } from "react";

const InventoryTable = ({ inventories, columns }) => {
	if (!inventories) {
		return <div>Fetching Inventories...</div>;
	}

    //add unique 'key' for each inventory item

    const inventoriesWithKeys = inventories.map((item, index) => ({
        ...item,
        key: item._id || index
    }))

	return <Table columns={columns} dataSource={inventoriesWithKeys} />;
};

export default InventoryTable;
