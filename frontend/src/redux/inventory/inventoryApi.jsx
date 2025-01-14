import { createAsyncThunk } from "@reduxjs/toolkit";

// Define the addInventory async thunk
export const addInventory = createAsyncThunk(
	"auth/addInventory",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await fetch(credentials.url, {
				method: credentials.method,
				headers: credentials.headers,
				body: JSON.stringify(credentials.formData),
				credentials: "include",
			});

			const data = await response.json();

			console.log("data: ", data);

			if (data.success === false) {
				return rejectWithValue(data?.message || "Failed to add Inventory");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue("An error occurred during adding new inventory in FE");
		}
	}
);