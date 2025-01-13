import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const { currentUser } = useSelector((state) => state.auth);

	let componentToRender;

	if (currentUser) {
		componentToRender = children;
	} else {
		componentToRender = <Navigate to="/siginin" />;
	}

	return componentToRender;
};

export default PrivateRoute;
