import { Table } from "antd";
import moment from "moment";
import React, { useMemo } from "react";

const InventoryTable = ({ records, columns }) => {
	if (!records) {
		return <div>Fetching records...</div>;
	}

    //add unique 'key' for each inventory item

    const recordsWithKeys = records.map((item, index) => ({
        ...item,
        key: item._id || index
    }))

	return <Table columns={columns} dataSource={recordsWithKeys}  className="cursor-pointer"/>;
};

export default InventoryTable;
