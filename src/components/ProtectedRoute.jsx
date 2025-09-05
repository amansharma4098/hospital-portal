import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("hospitalToken");
  return isLoggedIn ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
