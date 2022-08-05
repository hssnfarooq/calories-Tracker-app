/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";

const AdminRoute = ({ children, redirectTo, ...rest }) => {
  const { userData } = useContext(UserContext);
  const [userRole, setUserRole] = useState(null);
  const history = useHistory();
  // console.log("children, redirectTo, ...rest", children, redirectTo, {
  //   ...rest,
  // });userRole
  // const isLoggedIn = userData.user ? true : false;
  const isLoggedIn = localStorage.getItem("auth-token");
  useEffect(() => {
    if (isLoggedIn) {
      if (userData.user) {
        console.log("Private Route<<", userData.user.role);
        if (userData.user.role === "admin") {
          setUserRole(userData.user.role);
        } else {
          history.push("/404");
        }
      }
    } else {
      history.push("/");
    }
    //     setIsLoggedIn(true);
    //   }
  }, [userData.user]);
  return (
    <React.Fragment>
      {userRole === "admin" && (
        <Route
          {...rest}
          render={() => (isLoggedIn ? children : <Redirect to={redirectTo} />)}
        />
      )}
    </React.Fragment>
  );
};

export default AdminRoute;
