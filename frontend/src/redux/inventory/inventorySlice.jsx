import { createSlice } from "@reduxjs/toolkit";
import { addInventory, fetchBloodGroupData, fetchConsumptionRecords, fetchDonationRecords, fetchDonors, fetchHospitals, fetchInventories } from "./inventoryApi";

// Initial state for inventory slice
const initialState = {
	inventoryRecord: null,
    inventories: null,
    donors: null,
	hospitals: null,
	donationRecords: null,
	consumptionRecords: null,
	bloodData: [],
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
			})


			.addCase(fetchHospitals.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchHospitals.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.hospitals = action.payload.data.hospitals;
				state.success = action.payload.message;
			})
			.addCase(fetchHospitals.rejected, (state, action) => {
				state.loading = false;
				state.success = null;
				state.error = action.payload;
			})




			.addCase(fetchDonationRecords.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDonationRecords.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.donationRecords = action.payload.data.donations;
				state.success = action.payload.message;
			})
			.addCase(fetchDonationRecords.rejected, (state, action) => {
				state.loading = false;
				state.success = null;
				state.error = action.payload;
			})



			.addCase(fetchConsumptionRecords.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchConsumptionRecords.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.consumptionRecords = action.payload.data.consumptions;
				state.success = action.payload.message;
			})
			.addCase(fetchConsumptionRecords.rejected, (state, action) => {
				state.loading = false;
				state.success = null;
				state.error = action.payload;
			})


			.addCase(fetchBloodGroupData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchBloodGroupData.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.bloodData = action.payload;
				state.success = action.payload.message;
			})
			.addCase(fetchBloodGroupData.rejected, (state, action) => {
				state.loading = false;
				state.success = null;
				state.error = action.payload;
			});




	},
});

export const { resetInventoryState } = inventorySlice.actions;
export default inventorySlice.reducer;
