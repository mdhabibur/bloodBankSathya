import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routesProtection/PrivateRoute";
import PublicRoute from "./routesProtection/PublicRoute";
import EmailVerifiedRoute from "./routesProtection/EmailVerifiedRoute";
import { ConfigProvider } from "antd";
import Profile from "./pages/Profile/index.jsx";
import {antdCustomTheme} from "./theme/theme.js";

function App() {
	return (
		<ConfigProvider
			theme={antdCustomTheme}
		>
			<div className="bg-primary">
				<Router>
					<Routes>
						<Route
							path="/"
							element={
								<PrivateRoute>
									<Dashboard />
								</PrivateRoute>
							}
						/>
						<Route
							path="/signup"
							element={
								<PublicRoute>
									<SignUp />
								</PublicRoute>
							}
						/>
						<Route
							path="/signin"
							element={
								<PublicRoute>
									<SignIn />
								</PublicRoute>
							}
						/>
						<Route
							path="/verify-email"
							element={
								<PublicRoute>
									<VerifyEmail />
								</PublicRoute>
							}
						/>

						<Route
							path="/profile"
							element={
								<PrivateRoute>
									<Profile />
								</PrivateRoute>
							}
						/>
					</Routes>
				</Router>

				<Toaster />
			</div>
		</ConfigProvider>
	);
}

export default App;
