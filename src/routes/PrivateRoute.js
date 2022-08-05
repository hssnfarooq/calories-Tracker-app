/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "../context/UserContext";
import AdminRoute from "./AdminRoute";

const PrivateRoute = ({ children, redirectTo, isAdmin, ...rest }) => {
  const { userData } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  // console
  // const isLoggedIn = userData.user ? true : false;
  const isLoggedIn = localStorage.getItem("auth-token");
  useEffect(() => {
    //   if (userData.user) {
    console.log("Private Route<<", userData);
    setUserInfo(userData.user);
    //     setIsLoggedIn(true);
    //   }
  }, [userData.user]);
  return (
    <React.Fragment>
      {isAdmin ? (
        <AdminRoute {...rest} redirectTo={redirectTo}>
          {children}
        </AdminRoute>
      ) : (
        <Route
          {...rest}
          render={() => (isLoggedIn ? children : <Redirect to={redirectTo} />)}
        />
      )}
    </React.Fragment>
  );
};

export default PrivateRoute;
