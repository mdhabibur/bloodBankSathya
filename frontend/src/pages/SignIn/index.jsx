import { Button, Form, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	emailValidationRule,
	requiredFieldRule,
	urlValidationRule,
} from "../../../utils/formValidationRule";
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "../../redux/auth/authApi";
import { resetAuthState } from "../../redux/auth/authSlice";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const SignIn = () => {
	const [userType, setUserType] = useState("donor");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading, error, success } = useSelector((state) => state.auth);

	const handleUserTypeChange = (e) => {
		setUserType(e.target.value);
	};

	const onFinish = (formData) => {
		console.log("Form Values:", formData);

		try {
			dispatch(
				signInUser({
					url: "/api/auth/signin",
					formData,
					method: "POST",
					headers: { "Content-Type": "application/json" },
				})
			);
		} catch (error) {
			console.log("frontend Error: ", error);
		}
	};

	useEffect(() => {
		//timer object
		let timer;
		if (error || success) {
			if (success) {
				dispatch(resetAuthState());
				navigate("/");
				toast.success(success);
				return;
			}

			timer = setTimeout(() => {
				dispatch(resetAuthState());
			}, 3000);
		}

		//cleanup timer on unmount
		return () => clearTimeout(timer);
	}, [error, success, dispatch, navigate]);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md my-4">
				<h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>

				{error && toast.error(error)}

				<Form
					layout="vertical"
					onFinish={onFinish}
					initialValues={{ userType: "donor" }}
				>
					{/* User Type Selection */}
					<Form.Item label="" name="userType" className="font-bold">
						<Radio.Group onChange={handleUserTypeChange}>
							<Radio value="donor">Donor</Radio>
							<Radio value="hospital">Hospital</Radio>
							<Radio value="organization">Organization</Radio>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						label="Email"
						name="email"
						rules={[
							requiredFieldRule("Please enter your email"),
							emailValidationRule("Please enter a valid email"),
						]}
					>
						<Input placeholder="Enter your email" />
					</Form.Item>
					<Form.Item
						label="Password"
						name="password"
						rules={[requiredFieldRule("Please enter your password")]}
					>
						<Input.Password placeholder="Enter your password" />
					</Form.Item>

					<Form.Item>
						<Link to="/forgot-password" className="text-blue-500">
							Forgot Password?
						</Link>
					</Form.Item>

					{/* Submit Button */}
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="w-full uppercase"
							disabled={loading}
						>
							{loading ? (
								<Loader className="animate-spin mx-auto" size={24} />
							) : (
								"Sign In"
							)}
						</Button>
					</Form.Item>
				</Form>

				{/* Sign In Link */}
				<p className="text-center">
					Don't have an account?{" "}
					<Link to="/signup" className="text-blue-500">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignIn;
