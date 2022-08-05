/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "../context/UserContext";
// import { useAuthState } from "../../providers/authProvider";

const PublicRoute = ({ children, redirectTo, ...rest }) => {
  const { userData } = useContext(UserContext);

  // const isLoggedIn = userData.user ? true : false;
  const isLoggedIn = localStorage.getItem("auth-token");
  // useEffect(() => {
  //   if (userData.user) {
  // console.log("userData", userData.user);
  //     setIsLoggedIn(true);
  //   }
  // }, [userData.user]);

  return (
    <Route
      {...rest}
      render={() => (!isLoggedIn ? children : <Redirect to={redirectTo} />)}
    />
  );
};

export default PublicRoute;
