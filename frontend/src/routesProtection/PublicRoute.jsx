import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
	const { currentUser } = useSelector((state) => state.auth);

	let componentToRender;
	if (currentUser) {
		componentToRender = <Navigate to="/" />;
	} else {
		componentToRender = children;
	}

	return componentToRender;
};

export default PublicRoute;
