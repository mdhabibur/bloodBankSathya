import { Button, Form, Input, Radio } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	emailValidationRule,
	requiredFieldRule,
	urlValidationRule,
} from "../../../utils/formValidationRule";
import {useDispatch, useSelector} from 'react-redux'
import { signUpUser } from "../../redux/auth/authApi";

const SignUp = () => {
	const [userType, setUserType] = useState("donor");
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.auth);


	const handleUserTypeChange = (e) => {
		setUserType(e.target.value);
	};

	const onFinish = (formData) => {
		console.log("Form Values:", formData);

    dispatch(signUpUser({
      url: "/api/auth/signup",
      formData,
      method: "POST",
      headers: { "Content-Type": "application/json" },

    }))

	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md my-4">
				<h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
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

					{/* Common Fields */}
					<Form.Item
						label="Username"
						name="username"
						rules={[requiredFieldRule("Please enter your username")]}
					>
						<Input placeholder="Enter your username" />
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
					<Form.Item
						label="Phone"
						name="phone"
						rules={[requiredFieldRule("Please enter your phone number")]}
					>
						<Input placeholder="Enter your phone number" />
					</Form.Item>

					{/* Additional Fields for Hospital and Organization */}
					{(userType === "hospital" || userType === "organization") && (
						<>
							<Form.Item
								label={
									userType === "hospital"
										? "Hospital Name"
										: "Organization Name"
								}
								name={
									userType === "hospital" ? "hospitalName" : "organizationName"
								}
								rules={[requiredFieldRule("Please enter the name")]}
							>
								<Input
									placeholder={
										userType === "hospital"
											? "Enter hospital name"
											: "Enter organization name"
									}
								/>
							</Form.Item>
							<Form.Item
								label="Website"
								name="website"
								rules={[
									requiredFieldRule("Please enter the website URL"),
									urlValidationRule("Please enter a valid URL"),
								]}
							>
								<Input placeholder="Enter website URL" />
							</Form.Item>
						</>
					)}

					{/* Submit Button */}
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="w-full uppercase"
						>
							Sign Up
						</Button>
					</Form.Item>
				</Form>

				{/* Sign In Link */}
				<p className="text-center">
					Already have an account?{" "}
					<Link to="/signin" className="text-blue-500">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
