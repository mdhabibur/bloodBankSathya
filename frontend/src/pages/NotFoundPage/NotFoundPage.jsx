import { ArrowLeft } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
	const { currentUser } = useSelector((state) => state.auth);
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center rounded-lg p-8">
			<h1 className="text-6xl font-bold text-red-500">404</h1>
			<p className="text-2xl mt-4 text-gray-700">Page Not Found</p>

			<div className="px-8 py-4 bg-opacity-100 flex justify-center">
				{currentUser ? (
					<Link
						to={"/"}
						className="text-lg text-green-700 hover:underline flex items-center"
					>
						<ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
					</Link>
				) : (
					<Link
						to={"/signin"}
						className="text-lg text-green-700 hover:underline flex items-center"
					>
						<ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
					</Link>
				)}
			</div>
		</div>
	);
};

export default NotFoundPage;
