import React from 'react';
import { Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";

const ProtectedRoute = ({ element, admin }) => {
    const userDetails = useSelector((state) => state.userDetails);
    const isAuthenticated = (userDetails.token !== "") && (admin ? userDetails.roles.includes("ROLE_ADMIN") : true);

    return isAuthenticated ? element : <Navigate to="/no-permission" replace />;
};

export default ProtectedRoute;