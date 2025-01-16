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

export const fetchInventories = createAsyncThunk(
	"auth/fetchInventories",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await fetch(credentials.url, {
				method: credentials.method,
				credentials: "include",
			});

			const data = await response.json();

			console.log("data: ", data);

			if (data.success === false) {
				return rejectWithValue(data?.message || "Failed to fetch Inventory");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue("An error occurred during fetching inventory in FE");
		}
	}
);


export const fetchDonors = createAsyncThunk(
	"auth/fetchDonors",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await fetch(credentials.url, {
				method: credentials.method,
				credentials: "include",
			});

			const data = await response.json();

			console.log("data: ", data);

			if (data.success === false) {
				return rejectWithValue(data?.message || "Failed to fetch donors");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue("An error occurred during fetching donors in FE");
		}
	}
);


export const fetchHospitals = createAsyncThunk(
	"auth/fetchHospitals",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await fetch(credentials.url, {
				method: credentials.method,
				credentials: "include",
			});

			const data = await response.json();

			console.log("data: ", data);

			if (data.success === false) {
				return rejectWithValue(data?.message || "Failed to fetch hospitals");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue("An error occurred during fetching hospitals in FE");
		}
	}
);



export const fetchDonationRecords = createAsyncThunk(
	"auth/fetchDonationRecords",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await fetch(credentials.url, {
				method: credentials.method,
				credentials: "include",
			});

			const data = await response.json();

			console.log("data: ", data);

			if (data.success === false) {
				return rejectWithValue(data?.message || "Failed to fetch donations records");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue("An error occurred during fetching donations records in FE");
		}
	}
);


export const fetchConsumptionRecords = createAsyncThunk(
	"auth/fetchConsumptionRecords",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await fetch(credentials.url, {
				method: credentials.method,
				credentials: "include",
			});

			const data = await response.json();

			console.log("data: ", data);

			if (data.success === false) {
				return rejectWithValue(data?.message || "Failed to fetch consumption records");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue("An error occurred during fetching consumption records in FE");
		}
	}
);


export const fetchBloodGroupData = createAsyncThunk(
  "organization/fetchBloodGroupData",
  async (credentials, { rejectWithValue }) => {
    try {
      const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

      const promises = bloodGroups.map((group) =>
        fetch(credentials.url, {
          method: credentials.method,
          headers: credentials.headers,
          body: JSON.stringify({ bloodGroup: group }),
		  credentials: "include",
        })
      );

      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map((response) => response.json()));

      if (data.some((item) => item.success === false)) {
        return rejectWithValue("Failed to fetch data for some blood groups.");
      }

      return data.map((item) => item.data.bloodGroupsData); // Extract the relevant data for each group
    } catch (error) {
      console.error("Error fetching blood group data:", error);
      return rejectWithValue("An error occurred while fetching blood group data.");
    }
  }
);
