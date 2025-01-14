import { createSlice } from "@reduxjs/toolkit";
import { addInventory, fetchDonors, fetchInventories } from "./inventoryApi";

// Initial state for inventory slice
const initialState = {
	inventoryRecord: null,
    inventories: null,
    donors: null,
	loading: false,
	error: null,
	success: null,
};

const inventorySlice = createSlice({
	name: "inventory",
	initialState,
	reducers: {
		resetInventoryState: (state) => {
			state.error = null;
			state.success = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addInventory.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addInventory.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.inventoryRecord = action.payload.data.inventory;
				state.success = action.payload.message;
			})
			.addCase(addInventory.rejected, (state, action) => {
				state.loading = false;
				state.success = null;
				state.error = action.payload;
			})


            .addCase(fetchInventories.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchInventories.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.inventories = action.payload.data.inventories;
				state.success = action.payload.message;
			})
			.addCase(fetchInventories.rejected, (state, action) => {
				state.loading = false;
				state.success = null;
				state.error = action.payload;
			})


            .addCase(fetchDonors.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDonors.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.donors = action.payload.data.donors;
				state.success = action.payload.message;
			})
			.addCase(fetchDonors.rejected, (state, action) => {
				state.loading = false;
				state.success = null;
				state.error = action.payload;
			});



	},
});

export const { resetInventoryState } = inventorySlice.actions;
export default inventorySlice.reducer;
