import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

function ProtectedHandymenRoutes() {
  const { isLoggedIn, userName, userType } = useContext(LoginContext);
  const isAuthed = isLoggedIn && userName && userType === "handymen";

  return isAuthed ? <Outlet /> : <Navigate to="/handymen/login" />;
}

export default ProtectedHandymenRoutes;
