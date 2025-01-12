import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
	return (
		<div>
			<Router>
				<Routes>

					<Route path="/signup" element={<SignUp />} />
					<Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

				</Routes>
			</Router>

			<Toaster />
		</div>
	);
}

export default App;
