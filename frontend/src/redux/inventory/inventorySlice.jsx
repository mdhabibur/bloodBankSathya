import { createSlice } from "@reduxjs/toolkit";
import { addInventory } from "./inventoryApi";

// Initial state for inventory slice
const initialState = {
	inventoryRecord: null,
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
			});
	},
});

export const { resetInventoryState } = inventorySlice.actions;
export default inventorySlice.reducer;