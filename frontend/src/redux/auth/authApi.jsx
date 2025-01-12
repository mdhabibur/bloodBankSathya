import { createAsyncThunk } from "@reduxjs/toolkit";

// Define the signUpUser async thunk
export const signUpUser = createAsyncThunk(
	"auth/signUpUser",
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
				return rejectWithValue(data?.message || "Sign up failed");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue("An error occurred during sign-up in FE");
		}
	}
);

export const verifyEmail = createAsyncThunk(
	"auth/verifyEmail",
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
				return rejectWithValue(data?.message || "Email verification failed");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue(
				"An error occurred during email verification in FE"
			);
		}
	}
);

export const signInUser = createAsyncThunk(
	"auth/signInUser",
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
				return rejectWithValue(data?.message || "Sign In failed");
			}

			return data;
		} catch (error) {
			console.log("error: ", error);
			return rejectWithValue(
				"An error occurred during Sign In in FE"
			);
		}
	}
);
